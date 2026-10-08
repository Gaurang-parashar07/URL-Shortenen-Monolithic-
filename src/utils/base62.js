// Short code generator

const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

exports.encode = (num) => {
    let n = typeof num === "bigint" ? num : BigInt(num);
    if (n === 0n) return chars[0];

    let result = "";
    while (n > 0n) {
        result = chars[Number(n % 62n)] + result;
        n = n / 62n;
    }
    return result;
};

