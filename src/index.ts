import App from "./app.svelte"
import domready from "domready"
domready(() => {
  new App({ target: document.getElementById("mount-point")! })
})
