// snowpack.config.js

module.exports = {
  mount: { src: "/" },
  plugins: ["@snowpack/plugin-typescript", "@snowpack/plugin-svelte"],
  devOptions: { open: "none" },
}
