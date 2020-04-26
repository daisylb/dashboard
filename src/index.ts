import domready from "domready"

const FORMATTER = Intl.DateTimeFormat("en-AU-u-hc-h23", {
  hour: "numeric",
  minute: "numeric",
})

const NIGHT_GRADIENT: Keyframe = {
  "--gradient-top": "#cc00ff",
  "--gradient-bottom": "#5200ff",
}
const DUSK_GRADIENT: Keyframe = {
  "--gradient-top": "#ffe600",
  "--gradient-bottom": "#ff1f00",
}
const DAY_GRADIENT: Keyframe = {
  "--gradient-top": "white",
  "--gradient-bottom": "#69c9ff",
}

window.CSS.registerProperty({
  name: "--gradient-top",
  syntax: "<color>",
  initialValue: "white",
  inherits: false,
})

window.CSS.registerProperty({
  name: "--gradient-bottom",
  syntax: "<color>",
  initialValue: "white",
  inherits: false,
})

domready(() => {
  const clock = document.getElementById("clock")
  const updateClock = () => {
    const now = new Date()
    clock.innerText = FORMATTER.format(now)
    setTimeout(updateClock, 60_000 - (now.getTime() % 60_000))
  }
  const animation = clock.animate(
    [
      NIGHT_GRADIENT,
      DUSK_GRADIENT,
      DAY_GRADIENT,
      DUSK_GRADIENT,
      NIGHT_GRADIENT,
    ],
    { duration: 86_400_000, iterations: Infinity },
  )
  const now = new Date()
  animation.currentTime =
    (now.getTime() - now.getTimezoneOffset() * 60_000) % 86_400_000
  updateClock()
})
