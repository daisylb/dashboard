import * as ical from "ical.js"
import { DateTime } from "luxon"

export type EventOccurrence = {
  start: DateTime
  end: DateTime
  event: ical.Event
}

function icalToLuxon(icalDate: ical.Time): DateTime {
  return DateTime.fromJSDate(icalDate.toJSDate()).setZone(icalDate.timezone, {
    keepCalendarTime: true,
  })
}

export function* getEventsInRange(
  events: ical.Event[],
  start: DateTime,
  end: DateTime,
): Iterable<EventOccurrence> {
  const startJS = start.toUTC().toJSDate()
  const startSecs = start.toSeconds()
  const endSecs = end.toSeconds()

  const startIcal = ical.Time.fromJSDate(startJS, true)

  for (const event of events) {
    const iterator = event.iterator()
    while (!iterator.complete) {
      const nextOccurrence = iterator.next()
      if (nextOccurrence && nextOccurrence.toUnixTime() < startSecs) continue
      if (!nextOccurrence || nextOccurrence.toUnixTime() > endSecs) break
      const occurrenceDetails = event.getOccurrenceDetails(nextOccurrence)
      const start = icalToLuxon(occurrenceDetails.startDate)
      const end = icalToLuxon(occurrenceDetails.endDate)
      console.log(occurrenceDetails)
      yield { start, end, event: occurrenceDetails.item }
    }
    /*
    while (!iterator.complete && iterator.dtstart.toUnixTime() < end.toMillis() / 1000) {
      console.log(iterator.dtstart)
      yield { start: DateTime.fromJSDate(iterator.dtstart.toJSDate()) }
      iterator.next()
    }
    */
  }
}
