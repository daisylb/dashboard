import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions"
import * as secrets from "./_secrets.json"
import { OAuth2Client } from "google-auth-library"
import { encryptKey } from "../lib/crypto"

const handler: Handler = async (event, context) => {
  const client = new OAuth2Client(
    secrets.google.clientId,
    secrets.google.clientSecret,
    secrets.google.redirectUri,
  )
  if (
    !event.queryStringParameters ||
    !Object.keys(event.queryStringParameters).length
  ) {
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      // prompt: consent ensures we get a refresh token
      prompt: "consent",
    })
    return { statusCode: 302, headers: { Location: url } }
  } else if (event.queryStringParameters.code) {
    const code = event.queryStringParameters.code
    const token = await client.getToken(code)
    console.log(token.tokens)
    client.setCredentials({ refresh_token: token.tokens.refresh_token })
    const headers = await client.getRequestHeaders()
    console.log(headers)
    const encryptedToken = encryptKey(
      secrets.sodium.sk,
      token.tokens.refresh_token!,
    )
    return {
      statusCode: 200,
      body: encryptedToken,
      headers: { "Content-Type": "text/plain" },
    }
  }
}

export { handler }
