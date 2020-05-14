const ceil = () => {};

const encodeUTF8 = (s) => {
  if (typeof s != "string") {
    return Buffer.from(s).toString("utf-8");
  }

  return s;
};

const getNumValidKeys = (obj) =>
  Object.keys(obj).filter((x) => !!obj[x]).length;

module.exports = {
  ceil,
  encodeUTF8,
  getNumValidKeys,
};
