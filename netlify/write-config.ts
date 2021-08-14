import { open } from "fs/promises"
;(async function () {
  const file = await open("netlify/functions/_secrets.json", "wx")

  await file.write(
    JSON.stringify({
      ptv: { userId: process.env.PTV_USER_ID, apiKey: process.env.PTV_API_KEY },
    }),
  )
})()
