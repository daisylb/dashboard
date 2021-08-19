import { open } from "fs/promises"
;(async function () {
  const file = await open("_prod_config.json", "r")
  const data = await file.readFile("utf8")
  const config = JSON.parse(data)
  const smallerConfigString = JSON.stringify(config)
  const escapedConfig = encodeURIComponent(smallerConfigString)
  console.log(`https://leigh-dashboard.netlify.com/#${escapedConfig}`)
})()
