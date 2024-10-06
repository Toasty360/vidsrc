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
const crypto_1 = __importDefault(require("crypto"));
const types_1 = require("../utils/types");
class Vidlink extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.baseURL = "https://vidlink.pro/api/";
        this.key = Buffer.from("9f8dff95f42e0b9823f16bef28d2ca76063ab987ddd1f69718638f280db2df45", "hex");
        this.algorithm = "aes-256-cbc";
        this._cryptoMethods = {
            encodeID: (data) => {
                let iv = crypto_1.default.randomBytes(16);
                console.log(iv.buffer);
                let cipher = crypto_1.default.createCipheriv(this.algorithm, this.key, iv);
                let encrypted = Buffer.concat([
                    cipher.update(data, "utf8"),
                    cipher.final(),
                ]);
                return iv.toString("hex") + ":" + encrypted.toString("hex");
            },
            decodeID: (encrypted) => {
                let parts = encrypted.split(":");
                let iv = Buffer.from(parts.shift(), "hex");
                let encryptedText = Buffer.from(parts.join(":"), "hex");
                let decipher = crypto_1.default.createDecipheriv(this.algorithm, this.key, iv);
                let decrypted = Buffer.concat([
                    decipher.update(encryptedText),
                    decipher.final(),
                ]);
                return decrypted.toString();
            },
            decrypt: (encrypted) => {
                let parts = encrypted.split(":");
                let iv = Buffer.from(parts.shift(), "hex");
                let encryptedText = Buffer.from(parts.join(":"), "hex");
                let decipher = crypto_1.default.createDecipheriv(this.algorithm, this.key, iv);
                let decrypted = Buffer.concat([
                    decipher.update(encryptedText),
                    decipher.final(),
                ]);
                return decrypted.toString();
            },
        };
        this.getSource = (id, isMovie, season, episode) => __awaiter(this, void 0, void 0, function* () {
            const encoded = this._cryptoMethods.encodeID(id);
            const endpoint = isMovie
                ? `movie/${encoded}`
                : `tv/${encoded}/${season}/${episode}`;
            const response = yield (yield fetch(this.baseURL + endpoint)).text();
            const link = this._cryptoMethods.decrypt(response);
            return JSON.parse(link);
        });
    }
}
exports.default = Vidlink;
