<script lang="typescript">
  import { onMount } from "svelte"

  let inner: HTMLElement | undefined
  let outer: HTMLElement | undefined

  onMount(() => {
    resize()
    const observer = new ResizeObserver(() => resize())
    observer.observe(inner!)
    observer.observe(outer!)
  })
  function resize() {
    const factor = Math.min(
      outer!.offsetWidth / inner!.offsetWidth,
      outer!.offsetHeight / inner!.offsetHeight,
    )
    inner!.style.transform = `scale(${factor})`
  }
</script>

<div bind:this={outer} id="outer">
  <div bind:this={inner}>
    <slot />
  </div>
</div>

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
