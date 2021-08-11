import sn from "sodium-native"

const pk = Buffer.alloc(sn.crypto_box_PUBLICKEYBYTES)
const sk = Buffer.alloc(sn.crypto_box_PUBLICKEYBYTES)
sn.crypto_box_keypair(pk, sk)

console.log("pk:", pk.toString("base64"))
console.log("sk:", sk.toString("base64"))

const pt = Buffer.from("This is a secret", "utf8")
const ct = Buffer.alloc(pt.byteLength + sn.crypto_box_SEALBYTES)
sn.crypto_box_seal(ct, pt, pk)

console.log("pt:", pt.toString("base64"))
console.log("ct:", ct.toString("base64"))

function decodeEncryptedApiKey(encryptedString: string) {
  const ciphertext = Buffer.from(encryptedString, "base64")
  const plaintext = Buffer.alloc(
    ciphertext.byteLength - sn.crypto_box_SEALBYTES,
  )
  sn.crypto_box_seal_open(plaintext, ciphertext, publicKey, secretKey)
  return plaintext.toString("utf8")
}
