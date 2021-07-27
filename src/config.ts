import * as rt from "runtypes"

const Config = rt.Record({
  calendarUrls: rt.Array(rt.String),
})

const hash = window.location.hash
let error: string | undefined = undefined
try {
  const obj = JSON.parse(hash.substr(1))
} catch (e) {
  console.log(e)
  error = e?.message ?? e + ""
}
const data = error
  ? { success: false, message: error }
  : Config.validate(JSON.parse(decodeURIComponent(hash.substr(1))))

export default data
