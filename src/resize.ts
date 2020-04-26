import domready from "domready"

const template = document.createElement("template")
template.innerHTML = `
<style>
#outer {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 0;
  overflow: hidden;
}
</style>
<div id='outer'>
<div id='inner'>
  <slot></slot>
</div>
</div>
`

class ResizeContent extends HTMLElement {
  constructor() {
    super()
    console.log("Constructed", this)
    const shadow = this.attachShadow({ mode: "open" })
    shadow.appendChild(template.content.cloneNode(true))
    console.log(shadow.getElementById("outer"))
    this.resize()
    const observer = new ResizeObserver(() => this.resize())
    observer.observe(shadow.getElementById("inner"))
    observer.observe(shadow.getElementById("outer"))
  }
  resize() {
    const inner = this.shadowRoot.getElementById("inner")
    const outer = this.shadowRoot.getElementById("outer")
    const factor = Math.min(
      outer.offsetWidth / inner.offsetWidth,
      outer.offsetHeight / inner.offsetHeight,
    )
    inner.style.transform = `scale(${factor})`
  }
}

customElements.define("resize-content", ResizeContent)
console.log("registered CE")
