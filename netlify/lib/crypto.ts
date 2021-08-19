import sn from "sodium-native"
import { randomBytes } from "crypto"

export function encryptKey(sk: string, plaintext: string) {
  const secretKey = Buffer.from(sk, "base64")
  const plaintextBuffer = Buffer.from(plaintext, "utf8")
  const messageLen = plaintextBuffer.byteLength + sn.crypto_secretbox_MACBYTES
  const output = Buffer.alloc(messageLen + sn.crypto_secretbox_NONCEBYTES)
  const ciphertext = output.slice(0, messageLen)
  const nonce = randomBytes(sn.crypto_secretbox_NONCEBYTES)
  sn.crypto_secretbox_easy(ciphertext, plaintextBuffer, nonce, secretKey)
  console.log("ciphertext", ciphertext.toString("base64"))
  console.log("nonce", nonce.toString("base64"))
  output.set(nonce, messageLen)
  return output.toString("base64").replace("+", "-").replace("/", "_")
}

export function decryptKey(sk: string, input: string) {
  const secretKey = Buffer.from(sk, "base64")
  const inputBuffer = Buffer.from(input, "base64")
  const nonceOffset = inputBuffer.byteLength - sn.crypto_secretbox_NONCEBYTES
  const plaintext = Buffer.alloc(
    inputBuffer.byteLength -
      sn.crypto_secretbox_MACBYTES -
      sn.crypto_secretbox_NONCEBYTES,
  )
  const ciphertext = inputBuffer.slice(0, nonceOffset)
  const nonce = inputBuffer.slice(nonceOffset)
  console.log("ciphertext", ciphertext.toString("base64"))
  console.log("nonce", nonce.toString("base64"))
  sn.crypto_secretbox_open_easy(plaintext, ciphertext, nonce, secretKey)
  return plaintext.toString("utf8")
}
