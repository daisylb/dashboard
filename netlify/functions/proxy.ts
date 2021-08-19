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
    client.setCredentials({
      refresh_token: refreshToken,
    })
    const headers = await client.getRequestHeaders()
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
