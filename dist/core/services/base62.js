"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base62 = void 0;
const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = BigInt(CHARSET.length);
class Base62 {
    static encode(num) {
        if (num === 0n)
            return CHARSET[0];
        let str = '';
        while (num > 0n) {
            str = CHARSET[Number(num % BASE)] + str;
            num = num / BASE;
        }
        return str;
    }
    static decode(str) {
        let num = 0n;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const index = BigInt(CHARSET.indexOf(char));
            if (index === -1n) {
                throw new Error(`Invalid Base62 character: ${char}`);
            }
            num = num * BASE + index;
        }
        return num;
    }
}
exports.Base62 = Base62;
