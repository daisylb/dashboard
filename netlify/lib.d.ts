declare module "ptv-api-signature" {
  function pathWithSig(
    url: string,
    params: { name: string; value: string }[],
    devId: string,
    devKey: string,
  ): string
}
