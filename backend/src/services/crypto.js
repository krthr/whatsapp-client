const axlsign = require("axlsign");
const sjcl = require("../lib/sjcl");

const ba = sjcl.bitArray;

const generateRandomBytes = (n = 16) =>
  sjcl.codec.base64.fromBits(sjcl.random.randomWords(n / 4));

const arrayBufferToBits = (buff) => sjcl.codec.arrayBuffer.toBits(buff);
const base64ToBitArray = (str) => sjcl.codec.base64.toBits(str);

const bitArrayEqual = (a, b) => sjcl.bitArray.equal(a, b);

const hexFromBits = (bits) => sjcl.codec.hex.fromBits(bits);

/**
 * @returns {{ public: Uint8Array, private: Uint8Array }}
 */
const generateKeyPair = () => {
  let keySeed = sjcl.codec.arrayBuffer.fromBits(sjcl.random.randomWords(8));
  return axlsign.generateKeyPair(new Uint8Array(keySeed));
};

const generateSharedSecret = (private, secretPublicKey) =>
  axlsign.sharedKey(private, secretPublicKey);

const generateSecreyPublicKey = (secret) =>
  new Uint8Array(
    sjcl.codec.arrayBuffer.fromBits(ba.bitSlice(secret, 0, 32 * 8))
  );

const numToBits = (n) =>
  sjcl.codec.hex.toBits((n < 16 ? "0" : "") + n.toString(16));

function repeatedNumToBits(n, repeats) {
  let nBits = numToBits(n),
    ret = [];
  for (let i = 0; i < repeats; i++) ret = sjcl.bitArray.concat(ret, nBits);
  return ret;
}

//expects key and sign to be bit arrays
const HmacSha256 = (keyBits, signBits) =>
  new sjcl.misc.hmac(keyBits, sjcl.hash.sha256).mac(signBits);

const HKDF = (key, length) => {
  //expects key to be bit array, implements RFC 5869, some parts translated from https://github.com/MirkoDziadzka/pyhkdf
  let keyStream = [],
    keyBlock = [],
    blockIndex = 1;

  while (keyStream.length < length) {
    keyBlock = HmacSha256(
      key,
      sjcl.bitArray.concat(keyBlock, numToBits(blockIndex))
    );
    blockIndex++;
    keyStream = sjcl.bitArray.concat(keyStream, keyBlock);
  }

  return sjcl.bitArray.clamp(keyStream, length * 8);
};

const AES_BLOCK_SIZE = 16;

sjcl.beware[
  "CBC mode is dangerous because it doesn't protect message integrity."
]();

function AESEncrypt(key, plainbits) {
  let iv = sjcl.random.randomWords(AES_BLOCK_SIZE / 4);
  let prp = new sjcl.cipher.aes(key);
  let encrypted = sjcl.mode.cbc.encrypt(prp, plainbits, iv);

  return sjcl.bitArray.concat(iv, encrypted);
}

function AESDecrypt(key, cipherbits) {
  let iv = sjcl.bitArray.bitSlice(cipherbits, 0, AES_BLOCK_SIZE * 8);
  let prp = new sjcl.cipher.aes(key);
  let decrypted = sjcl.mode.cbc.decrypt(
    prp,
    sjcl.bitArray.bitSlice(cipherbits, AES_BLOCK_SIZE * 8),
    iv
  );

  return decrypted;
}

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

module.exports = {
  hexFromBits,
  bitArrayEqual,
  arrayBufferToBits,
  generateKeyPair,
  AESDecrypt,
  AESEncrypt,
  generateRandomBytes,
  base64ToBitArray,
  generateSecreyPublicKey,
  generateSharedSecret,
  HKDF,
  HmacSha256,
  repeatedNumToBits,
  sjcl,
  ba,
  toArrayBuffer,
};
