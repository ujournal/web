// https://stackoverflow.com/questions/68141513/how-to-create-a-hash-using-web-crypto-api
export default async function digest(message, algo = "SHA-1") {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(algo, new TextEncoder().encode(message)),
    ),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}
