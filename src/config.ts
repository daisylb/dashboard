import * as rt from "runtypes"

const Config = rt.Record({
  calendarUrls: rt.Array(rt.String),
})

const hash = window.location.hash
const data = Config.validate(JSON.parse(decodeURIComponent(hash.substr(1))))

export default data
