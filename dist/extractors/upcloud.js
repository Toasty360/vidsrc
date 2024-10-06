"use strict";
//vidsrc.cc/v2/embed/tv/124364/1/5
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
const types_1 = require("../utils/types");
class Upcloud extends types_1.Provider {
    constructor() {
        super(...arguments);
        this.baseUrl = "https://vidsrc.cc/";
        this.headers = {
            Referer: this.baseUrl,
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        };
    }
    getSource(id, isMovie, season, episode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mediaurl = this.baseUrl +
                    "v2/embed/" +
                    (isMovie ? `movie/${id}` : `tv/${id}/${season}/${episode}`);
                console.log(mediaurl);
                const [title, movieId, v] = yield (yield fetch(mediaurl, {
                    headers: Object.assign(Object.assign({}, this.headers), { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", Connection: "keep-alive", "Sec-Fetch-Dest": "document" }),
                }))
                    .text()
                    .then((resp) => {
                    console.log(resp.match(/<title>(.*?)<\/title>/)[1]);
                    return [
                        resp.match(/<title>(.*?)<\/title>/)[1],
                        resp.match(/data-id="(.*?)"/g)[1].split('"')[1],
                        resp.match(/var\s*v\s*=\s*"(.*?)"/)[1],
                    ];
                });
                const params = new URLSearchParams(Object.assign({ id: String(id), type: isMovie ? "movie" : "tv", v: String(v), vrf: "uwu", isMobile: "false" }, (isMovie
                    ? {}
                    : { season: String(season), episode: String(episode) })));
                console.log(this.baseUrl + `api/episodes/${id}/servers?${params}`);
                var { data } = yield (yield fetch(this.baseUrl + `api/episodes/${id}/servers?${params}`, {
                    headers: this.headers,
                })).json();
                let hash = data.find((source) => source.name === "UpCloud").hash;
                console.log(this.baseUrl + "api/source/" + hash, Object.assign(Object.assign({}, this.headers), { Referer: `${this.baseUrl}upcloud/e/${hash}?init=true&key=${v}` }));
                const source = yield (yield fetch(this.baseUrl + "api/source/" + hash, {
                    headers: Object.assign(Object.assign({}, this.headers), { Referer: `${this.baseUrl}upcloud/e/${hash}?init=true&key=${v}` }),
                })).json();
                console.log(source);
                // return title;
                return Object.assign({ title }, source);
            }
            catch (error) {
                console.log("faild ", error);
                throw error;
            }
        });
    }
}
exports.default = Upcloud;
// faild  TypeError: Cannot read properties of null (reading '1')
//     at <anonymous> (/vercel/path1/src/vidsrc.ts:28:38)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
