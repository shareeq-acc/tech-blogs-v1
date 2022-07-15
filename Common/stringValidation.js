// Check if Alpha Numeric
export const isAlphaNumeric = (str) => {
    let code, len, i;
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (
            !(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) // lower alpha (a-z)
        ) {
            return false;
        }
    }
    return true;
};

// Check if Only Letters
export const onlyLetters = (str) => {
    return /^[a-zA-Z]+$/.test(str);
};
