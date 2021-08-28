import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions"
import axios, { AxiosRequestConfig } from "axios"
import { URL } from "url"
import { pathWithSig } from "ptv-api-signature"
import * as secrets from "./_secrets.json"
import { OAuth2Client } from "google-auth-library"
import { decryptKey } from "../lib/crypto"
import { createClient } from "redis"
import { promisify } from "util"

const redisClient = createClient({
  url: secrets.redis,
  tls: true,
})

const domainHandlers = new Map<
  string,
  (
    url: URL,
    event: HandlerEvent,
    context: HandlerContext,
  ) => Promise<HandlerResponse>
>()

domainHandlers.set(
  "timetableapi.ptv.vic.gov.au",
  async (url, event, context) => {
    console.log(`'${url.toString()}'`)
    const newPath = pathWithSig(
      url.pathname,
      Array.from(url.searchParams.entries()).map(([name, value]) => ({
        name,
        value,
      })),
      secrets.ptv.userId,
      secrets.ptv.apiKey,
    )
    console.log(newPath)
    const resp = await axios.request({
      url: `http://timetableapi.ptv.vic.gov.au/${newPath}`,
      method: event.httpMethod as AxiosRequestConfig["method"],
      // TODO: remove Host etc
      //headers: event.headers,

      data:
        event.body && event.isBase64Encoded
          ? Buffer.from(event.body, "base64")
          : event.body,
      responseType: "arraybuffer",
      validateStatus: () => true,
    })
    return {
      statusCode: resp.status,
      // TODO: remove Content-Length etc
      //headers: resp.headers,
      body: resp.data.toString("base64"),
      isBase64Encoded: true,
    }
  },
)
domainHandlers.set(
  "httpbin.org",
  domainHandlers.get("timetableapi.ptv.vic.gov.au")!,
)

domainHandlers.set(
  "apidata.googleusercontent.com",
  async (url, event, context) => {
    const client = new OAuth2Client(
      secrets.google.clientId,
      secrets.google.clientSecret,
      secrets.google.redirectUri,
    )
    const refreshToken = decryptKey(
      secrets.sodium.sk,
      event.queryStringParameters!.key!,
    )
    console.log("refreshToken", refreshToken)
    const redisResult = await promisify(redisClient.get).call(
      redisClient,
      `tokens.1.${refreshToken}`,
    )
    const [accessToken, expiryStr] = redisResult
      ? redisResult.split("\u001f")
      : [undefined, undefined]
    client.setCredentials({
      refresh_token: refreshToken,
      access_token: accessToken,
      expiry_date: Number.parseInt(expiryStr),
    })
    client.on("tokens", async (tokens) => {
      console.log("writing new tokens", tokens)
      await promisify(redisClient.set).call(
        redisClient,
        `tokens.1.${refreshToken}`,
        `${tokens.access_token}\u001f${tokens.expiry_date}`,
      )
    })
    const headers = await client.getRequestHeaders()
    const newAccessToken = (await client.getAccessToken()).token
    console.log("at from redis", accessToken, "new at", newAccessToken)
    console.log("headers", headers)
    const resp = await axios.request({
      url: url.toString(),
      method: event.httpMethod as AxiosRequestConfig["method"],
      headers,
      // TODO: remove Host etc
      //headers: event.headers,

      data:
        event.body && event.isBase64Encoded
          ? Buffer.from(event.body, "base64")
          : event.body,
      responseType: "arraybuffer",
      validateStatus: () => true,
    })
    return {
      statusCode: resp.status,
      // TODO: remove Content-Length etc
      //headers: resp.headers,
      body: resp.data.toString("base64"),
      isBase64Encoded: true,
    }
  },
)

const handler: Handler = async (event, context) => {
  const url = new URL(event.queryStringParameters!["url"]!)
  const handler = domainHandlers.get(url.host)
  return await handler!(url, event, context)
}

export { handler }
