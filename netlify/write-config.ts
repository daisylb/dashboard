import { open } from "fs/promises"
;(async function () {
  const file = await open("netlify/functions/_secrets.json", "wx")

  await file.write(
    JSON.stringify({
      ptv: { userId: process.env.PTV_USER_ID, apiKey: process.env.PTV_API_KEY },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri:
          "https://leigh-dashboard.netlify.app/.netlify/functions/gauth",
      },
      sodium: {
        sk: process.env.SODIUM_SK,
      },
      redis: process.env.REDIS_URL,
    }),
  )
})()
