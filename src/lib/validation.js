
const isArray = array => !!(Array.isArray(array));
const isNumber = number => !!(typeof number === "number");
const isString = string => !!(typeof string === "string");

const isArrayEmpty = array =>  {
    if(!isArray(array)) return;
    return array.length === 0 ? true : false;
}

module.exports = {
    isArrayEmpty,
    isArray,
    isNumber,
    isString
}