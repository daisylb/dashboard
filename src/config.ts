import * as rt from "runtypes"

const Config = rt.Record({
  calendarUrls: rt.Array(rt.String),
})

const hash = window.location.hash
let error: string | undefined = undefined
let obj: any
try {
  obj = JSON.parse(decodeURIComponent(hash.substr(1)))
} catch (e) {
  console.log(e)
  error = e?.message ?? e + ""
}
const data = error ? { success: false, message: error } : Config.validate(obj)

export default data
