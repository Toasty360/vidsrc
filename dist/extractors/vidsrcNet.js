"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const types_1 = require("../utils/types");
class VidsrcNet extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.baseUrl = "https://vidsrc.net/";
        this.headers = {
            Referer: this.baseUrl,
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        };
        this._decryptMethods = {
            TsA2KGDGux: (inputString) => {
                const reversedString = inputString.split("").reverse().join("");
                const base64String = reversedString.replace(/-/g, "+").replace(/_/g, "/");
                const decodedString = atob(base64String);
                let result = "";
                const shift = 7;
                for (let i = 0; i < decodedString.length; i++) {
                    result += String.fromCharCode(decodedString.charCodeAt(i) - shift);
                }
                return result;
            },
            ux8qjPHC66: (inputString) => {
                const reversedString = inputString.split("").reverse().join("");
                const hexPairs = reversedString
                    .match(/.{1,2}/g)
                    .map((hex) => String.fromCharCode(parseInt(hex, 16)))
                    .join("");
                const key = "X9a(O;FMV2-7VO5x;Ao:dN1NoFs?j,";
                let result = "";
                for (let i = 0; i < hexPairs.length; i++) {
                    result += String.fromCharCode(hexPairs.charCodeAt(i) ^ key.charCodeAt(i % key.length));
                }
                return result;
            },
            xTyBxQyGTA: (inputString) => {
                const reversedString = inputString.split("").reverse().join("");
                let result = "";
                for (let i = 0; i < reversedString.length; i += 2) {
                    result += reversedString[i];
                }
                return atob(result);
            },
            IhWrImMIGL: (inputString) => {
                const reversedString = inputString.split("").reverse().join("");
                const rot13String = reversedString.replace(/[a-zA-Z]/g, (char) => {
                    return String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < "n" ? 13 : -13));
                });
                const finalReversedString = rot13String.split("").reverse().join("");
                return atob(finalReversedString);
            },
            o2VSUnjnZl: (inputString) => {
                const substitutionMap = {
                    x: "a",
                    y: "b",
                    z: "c",
                    a: "d",
                    b: "e",
                    c: "f",
                    d: "g",
                    e: "h",
                    f: "i",
                    g: "j",
                    h: "k",
                    i: "l",
                    j: "m",
                    k: "n",
                    l: "o",
                    m: "p",
                    n: "q",
                    o: "r",
                    p: "s",
                    q: "t",
                    r: "u",
                    s: "v",
                    t: "w",
                    u: "x",
                    v: "y",
                    w: "z",
                    X: "A",
                    Y: "B",
                    Z: "C",
                    A: "D",
                    B: "E",
                    C: "F",
                    D: "G",
                    E: "H",
                    F: "I",
                    G: "J",
                    H: "K",
                    I: "L",
                    J: "M",
                    K: "N",
                    L: "O",
                    M: "P",
                    N: "Q",
                    O: "R",
                    P: "S",
                    Q: "T",
                    R: "U",
                    S: "V",
                    T: "W",
                    U: "X",
                    V: "Y",
                    W: "Z",
                };
                return inputString.replace(/[xyzabcdefghijklmnopqrstuvwXYZABCDEFGHIJKLMNOPQRSTUVW]/g, (char) => {
                    return substitutionMap[char];
                });
            },
            eSfH1IRMyL: (inputString) => {
                const reversedString = inputString.split("").reverse().join("");
                let shiftedString = "";
                for (let i = 0; i < reversedString.length; i++) {
                    shiftedString += String.fromCharCode(reversedString.charCodeAt(i) - 1);
                }
                let result = "";
                for (let i = 0; i < shiftedString.length; i += 2) {
                    result += String.fromCharCode(parseInt(shiftedString.substr(i, 2), 16));
                }
                return result;
            },
            Oi3v1dAlaM: (inputString) => {
                const reversedString = inputString.split("").reverse().join("");
                const base64String = reversedString.replace(/-/g, "+").replace(/_/g, "/");
                const decodedString = atob(base64String);
                let result = "";
                const shift = 5;
                for (let i = 0; i < decodedString.length; i++) {
                    result += String.fromCharCode(decodedString.charCodeAt(i) - shift);
                }
                return result;
            },
            sXnL9MQIry: (inputString) => {
                const xorKey = "pWB9V)[*4I`nJpp?ozyB~dbr9yt!_n4u";
                let decrypted = "";
                const hexDecoded = inputString
                    .match(/.{1,2}/g)
                    .map((hex) => String.fromCharCode(parseInt(hex, 16)))
                    .join("");
                for (let i = 0; i < hexDecoded.length; i++) {
                    decrypted += String.fromCharCode(hexDecoded.charCodeAt(i) ^ xorKey.charCodeAt(i % xorKey.length));
                }
                let shifted = "";
                for (let i = 0; i < decrypted.length; i++) {
                    shifted += String.fromCharCode(decrypted.charCodeAt(i) - 3);
                }
                return atob(shifted);
            },
            JoAHUMCLXV: (inputString) => {
                const reversedString = inputString.split("").reverse().join("");
                const base64String = reversedString.replace(/-/g, "+").replace(/_/g, "/");
                const decodedString = atob(base64String);
                let result = "";
                const shift = 3;
                for (let i = 0; i < decodedString.length; i++) {
                    result += String.fromCharCode(decodedString.charCodeAt(i) - shift);
                }
                return result;
            },
            KJHidj7det: (input) => {
                const decoded = atob(input.slice(10, -16));
                const key = '3SAY~#%Y(V%>5d/Yg"$G[Lh1rK4a;7ok';
                const extendedKey = key
                    .repeat(Math.ceil(decoded.length / key.length))
                    .substring(0, decoded.length);
                let result = "";
                for (let i = 0; i < decoded.length; i++) {
                    result += String.fromCharCode(decoded.charCodeAt(i) ^ extendedKey.charCodeAt(i));
                }
                return result;
            },
        };
    }
    getSource(id, isMovie, season, episode) {
        return __awaiter(this, void 0, void 0, function* () {
            // tv?tmdb=18165&season=6&episode=6
            // "movie?tmdb=141723";
            let m3u8Link = "";
            let link = this.baseUrl +
                "embed/" +
                (isMovie
                    ? `movie?tmdb=${id}`
                    : `tv?tmdb=${id}&season=${season}&episode=${episode}`);
            try {
                const response = yield fetch(link);
                const source = yield response.text();
                const urlRCP = "https:" + source.match(/src="(.*?)"/)[1];
                const urlPRORCP = yield fetch(urlRCP, {
                    headers: { Referer: link },
                }).then((resp) => __awaiter(this, void 0, void 0, function* () {
                    const r = yield resp.text();
                    return urlRCP.split("rcp")[0] + r.match(/src.*'(.*?)'/)[1];
                }));
                const encryptedURL = yield fetch(urlPRORCP, {
                    headers: {
                        Referer: urlRCP,
                    },
                })
                    .then((resp) => resp.text())
                    .then((text) => {
                    const $ = (0, cheerio_1.load)(text);
                    const node = $("#reporting_content").next();
                    return { id: node.attr("id"), content: node.text() };
                });
                m3u8Link = this._decryptMethods[encryptedURL.id](encryptedURL.content);
                return {
                    url: m3u8Link,
                    referer: urlRCP.split("rcp")[0],
                };
            }
            catch (error) {
                console.error(error);
            }
            return {
                msg: "Could not decrypt",
            };
        });
    }
}
exports.default = VidsrcNet;
