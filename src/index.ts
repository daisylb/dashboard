import Clock from "./clock.svelte"
import domready from "domready"
domready(() => {
  new Clock({ target: document.getElementById("mount-point")! })
})
