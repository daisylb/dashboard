<script lang="typescript">
  import domready from "domready"
  import Resize from "./resize.svelte"
  import time from "./time"

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
  try {
    ;(window.CSS as any).registerProperty({
      name: "--gradient-top",
      syntax: "<color>",
      initialValue: "white",
      inherits: false,
    })
    ;(window.CSS as any).registerProperty({
      name: "--gradient-bottom",
      syntax: "<color>",
      initialValue: "white",
      inherits: false,
    })
  } catch {}

  $: formattedTime = $time.toFormat("HH:mm")
  let clock: HTMLElement | null = null

  domready(() => {
    const animation = clock!.animate(
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
  })
  function reload(){
    window.location.reload()
  }
</script>

<Resize>
  <div id="clock" bind:this={clock} on:click={reload}>{formattedTime}</div>
</Resize>

<style>
  #clock {
    font-family: Inter, sans-serif;
    font-variant-numeric: tabular-nums;
    font-weight: 900;
    margin: 10px;
    font-size: 100px;
    background-image: linear-gradient(
      0deg,
      var(--gradient-bottom) 0%,
      var(--gradient-top) 100%
    );
    background-color: white;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
</style>
