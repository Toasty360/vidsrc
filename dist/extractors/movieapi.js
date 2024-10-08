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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieApi = void 0;
const types_1 = require("../utils/types");
const crypto_js_1 = __importDefault(require("crypto-js"));
class MovieApi extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.baseUrl = "https://moviesapi.club/";
        this.secretKey = "1FHuaQhhcsKgpTRB";
        this.decrypt = (jsonStr, password) => {
            return JSON.parse(crypto_js_1.default.AES.decrypt(jsonStr, password, {
                format: {
                    parse: (json) => {
                        const j = JSON.parse(json);
                        return crypto_js_1.default.lib.CipherParams.create({
                            ciphertext: crypto_js_1.default.enc.Base64.parse(j.ct),
                            iv: j.iv ? crypto_js_1.default.enc.Hex.parse(j.iv) : undefined,
                            salt: j.s ? crypto_js_1.default.enc.Hex.parse(j.s) : undefined,
                        });
                    },
                    stringify: (cipherParams) => {
                        const jsonObj = {
                            ct: cipherParams.ciphertext.toString(crypto_js_1.default.enc.Base64),
                        };
                        if (cipherParams.iv)
                            jsonObj.iv = cipherParams.iv.toString(crypto_js_1.default.enc.Hex);
                        if (cipherParams.salt)
                            jsonObj.s = cipherParams.salt.toString(crypto_js_1.default.enc.Hex);
                        return JSON.stringify(jsonObj);
                    },
                },
            }).toString(crypto_js_1.default.enc.Utf8));
        };
    }
    getSource(id, isMovie, season, episode) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const url = `${this.baseUrl}${isMovie ? `movie/${id}` : `tv/${id}-${season}-${episode}`}`;
                console.log(url);
                const iframe = yield (yield fetch(url, {
                    headers: { Referer: this.baseUrl },
                }))
                    .text()
                    .then((data) => { var _a; return (_a = data.match(/<iframe.*src="(.*?)"/)) === null || _a === void 0 ? void 0 : _a[1]; });
                if (!iframe)
                    return "bruh iframe crashed";
                const jsonStr = (_a = (yield (yield fetch(iframe, { headers: { Referer: this.baseUrl } })).text()).match(/<script.*?'(.*?)'.*<\/script>/)) === null || _a === void 0 ? void 0 : _a[1];
                if (!jsonStr)
                    return "jsonsstr nuked";
                const decryptedString = this.decrypt(jsonStr, this.secretKey);
                const sources = (_b = decryptedString.match(/sources\s*:\s*(\[.*?\])/)) === null || _b === void 0 ? void 0 : _b[1];
                const tracks = (_c = decryptedString.match(/tracks\s*:\s*(\[.*?\])/)) === null || _c === void 0 ? void 0 : _c[1];
                return sources && tracks
                    ? {
                        url: JSON.parse(sources),
                        captions: JSON.parse(tracks),
                        referer: this.baseUrl,
                        source: "Movieapi.club",
                    }
                    : null;
            }
            catch (error) {
                console.error("Error fetching source:", error);
                return null;
            }
        });
    }
}
exports.MovieApi = MovieApi;
