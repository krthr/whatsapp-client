const {
  WATags,
  WASingleByteTokens,
  WADoubleByteTokens,
  WAWebMessageInfo,
} = require("./whatsapp_defines");

class WABinaryReader {
  /**
   *
   * @param {Buffer} data
   */
  constructor(data) {
    this.data = data;
    this.index = 0;
  }

  /**
   * Check end of the data.
   * @param {Number} length
   */
  checkEOS(length) {
    if (this.index + length > this.data.length) {
      throw "end of stream reached";
    }
  }

  /**
   * Read next byte
   */
  readByte() {
    this.checkEOS(1);

    const ret = this.data[this.index];
    this.index++;

    return ret;
  }

  /**
   *
   * @param {*} n
   * @param {*} littleEndian
   */
  readIntN(n, littleEndian = false) {
    this.checkEOS(n);
    let ret = 0;

    for (let i = 0; i < n; i++) {
      const currShift = littleEndian ? i : n - 1 - i;
      ret |= this.data[this.index + i] << (currShift * 8);
    }

    this.index += n;
    return ret;
  }

  readInt16(littleEndian = false) {
    return this.readIntN(2, littleEndian);
  }

  readInt20() {
    this.checkEOS(3);

    const ret =
      ((this.data[this.index] & 15) << 16) +
      (this.data[this.index + 1] << 8) +
      this.data[this.index + 2];

    this.index += 3;

    return ret;
  }

  readInt32(littleEndian = false) {
    return this.readIntN(4, littleEndian);
  }

  readInt64(littleEndian) {
    return this.readIntN(8, littleEndian);
  }

  readPacked8(tag) {
    const startByte = this.readByte();
    let ret = "";

    for (let i = 0; i < (startByte & 127); i++) {
      const currByte = this.readByte();

      ret +=
        this.unpackByte(tag, (currByte & 0xf0) >> 4) +
        this.unpackByte(tag, currByte & 0x0f);
    }

    if (startByte >> 7 != 0) {
      ret = ret.slice(0, ret.length - 1);
    }

    return ret;
  }

  unpackByte(tag, value) {
    if (tag == WATags.NIBBLE_8) {
      return this.unpackNibble(value);
    } else if (tag == WATags.HEX_8) {
      return this.unpackHex(value);
    }
  }

  unpackNibble(value) {
    if (value >= 0 && value <= 9) {
      return String.fromCharCode("0".charCodeAt(0) + value);
    } else if (value == 10) {
      return "-";
    } else if (value == 11) {
      return ".";
    } else if (value == 15) {
      return "\0";
    }

    throw "invalid nibble to unpack: " + value;
  }

  unpackHex(value) {
    if (value < 0 || value > 15) {
      throw "invalid hex to unpack: " + value;
    }

    if (value < 10) {
      return String.fromCharCode("0".charCodeAt(0) + value);
    } else {
      return String.fromCharCode("A".charCodeAt(0) + value - 10);
    }
  }

  readRangedVarInt(minVal, maxVal, desc = "unknown") {
    let ret = this.readVarInt();

    if (ret < minVal || ret >= maxVal) {
      throw "varint for " + desc + " is out of bounds: " + ret;
    }

    return ret;
  }

  isListTag(tag) {
    return (
      tag == WATags.LIST_EMPTY || tag == WATags.LIST_8 || tag == WATags.LIST_16
    );
  }

  readListSize(tag) {
    if (tag == WATags.LIST_EMPTY) {
      return 0;
    } else if (tag == WATags.LIST_8) {
      return this.readByte();
    } else if (tag == WATags.LIST_16) {
      return this.readInt16();
    }

    throw `invalid tag for list size: ${tag}`;
  }

  readString(tag) {
    if (tag >= 3 && tag <= 235) {
      let token = this.getToken(tag);
      if (token == "s.whatsapp.net") {
        token = "c.us";
      }
      return token;
    }

    if (
      tag == WATags.DICTIONARY_0 ||
      tag == WATags.DICTIONARY_1 ||
      tag == WATags.DICTIONARY_2 ||
      tag == WATags.DICTIONARY_3
    ) {
      return this.getTokenDouble(tag - WATags.DICTIONARY_0, this.readByte());
    } else if (tag == WATags.LIST_EMPTY) {
      return;
    } else if (tag == WATags.BINARY_8) {
      return this.readStringFromChars(this.readByte());
    } else if (tag == WATags.BINARY_20) {
      return this.readStringFromChars(this.readInt20());
    } else if (tag == WATags.BINARY_32) {
      return this.readStringFromChars(self.readInt32());
    } else if (tag == WATags.JID_PAIR) {
      const i = this.readString(this.readByte());
      const j = this.readString(this.readByte());

      if (!i || !j) {
        throw `invalid jid pair: ${i},${j}`;
      }

      return `${i}@${j}`;
    } else if (tag == WATags.NIBBLE_8 || tag == WATags.HEX_8) {
      return this.readPacked8(tag);
    } else {
      return `invalid string with tag ${tag}`;
    }
  }

  readStringFromChars(length) {
    this.checkEOS(length);

    const ret = this.data.slice(this.index, this.index + length);
    this.index += length;

    return ret;
  }

  readAttributes(n) {
    const ret = {};

    if (n == 0) return;

    for (let i = 0; i < n; i++) {
      const index = this.readString(this.readByte());
      ret[index] = this.readString(this.readByte());
    }

    return ret;
  }

  readList(tag) {
    const ret = [];

    const listSize = this.readListSize(tag);
    for (let i = 0; i < listSize; i++) {
      const node = this.readNode();
      ret.push(node);
    }

    return ret;
  }

  readNode() {
    // console.log("===");

    const listSize = this.readListSize(this.readByte());
    const descrTag = this.readByte();

    // console.log({
    //   listSize,
    //   descrTag,
    // });

    if (descrTag == WATags.STREAM_END) {
      throw "unexpected stream end";
    }

    const descr = this.readString(descrTag);

    // console.log({ descr });

    if (listSize == 0 || !descr) {
      throw "invalid node";
    }

    const attrs = this.readAttributes((listSize - 1) >> 1);

    // console.log({ attrs });

    if (listSize % 2 == 1) {
      return [descr, attrs, null];
    }

    const tag = this.readByte();

    // console.log({ tag });

    let content;
    if (this.isListTag(tag)) {
      content = this.readList(tag);
    } else if (tag == WATags.BINARY_8) {
      content = this.readBytes(this.readByte());
    } else if (tag == WATags.BINARY_20) {
      content = this.readBytes(this.readInt20());
    } else if (tag == WATags.BINARY_32) {
      content = this.readBytes(this.readInt32());
    } else {
      content = this.readString(tag);
    }

    // console.log({ content });

    return [descr, attrs, content];
  }

  readBytes(n) {
    let ret = "";

    for (let i = 0; i < n; i++) {
      ret += String.fromCharCode(this.readByte());
    }

    return ret;
  }

  getToken(index) {
    if (index < 3 || index >= WASingleByteTokens.length)
      throw `invalid token index: ${index}`;
    return WASingleByteTokens[index];
  }

  getTokenDouble(index1, index2) {
    const n = 256 * index1 + index2;

    if (n < 0 || n >= WADoubleByteTokens.length) {
      throw "invalid token index: " + n;
    }

    return WADoubleByteTokens[n];
  }
}

const whatsappReadMessageArray = (msgs) => {
  if (!Array.isArray(msgs)) return msgs;

  const ret = [];

  for (let x of msgs) {
    ret.push(
      Array.isArray(x) && x[0] == "message" ? WAWebMessageInfo.decode(x[2]) : x
    );
  }

  return ret;
};

const whatsappReadBinary = (data, withMessages = false) => {
  const node = new WABinaryReader(data).readNode();

  if (withMessages && !!node[1]) {
    node[2] = whatsappReadMessageArray(node[2]);
  }

  return node;
};

module.exports = {
  whatsappReadBinary,
};
