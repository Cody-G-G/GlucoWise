'use strict';
export default (hexArg) => {
    const hexArgStr = hexArg.toString();
    let resultStr = '';
    for (let i = 0; i < hexArgStr.length; i += 2)
        resultStr += String.fromCharCode(parseInt(hexArgStr.substr(i, 2), 16));
    return resultStr;
}