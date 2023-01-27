import * as rt from "runtypes"

const Config = rt.Record({
  calendarUrls: rt.Array(rt.String),
  departures: rt.Record({
    stopId: rt.Number,
    directionGroups: rt.Array(rt.Array(rt.Number)),
  }),
})

const hash = window.location.hash
let error: string | undefined = undefined
let obj: any
try {
  obj = JSON.parse(decodeURIComponent(hash.substr(1)))
} catch (e) {
  console.log(e)
  error = e + ""
}
const data = error
  ? { success: false as const, message: error }
  : Config.validate(obj)

export default data
