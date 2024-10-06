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
const baseurl = "https://vidsrc.cc/";
var headers = {
    Referer: baseurl,
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
};
const getSource = (movieId, isMovie, season, episode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaurl = baseurl +
            "v2/embed/" +
            (isMovie ? `movie/${movieId}` : `tv/${movieId}/${season}/${episode}`);
        console.log(mediaurl);
        const [title, id, v] = yield (yield fetch(mediaurl, {
            headers: Object.assign(Object.assign({}, headers), { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", Connection: "keep-alive", "Sec-Fetch-Dest": "document" }),
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
        const params = new URLSearchParams(Object.assign({ id: String(movieId), type: isMovie ? "movie" : "tv", v: String(v), vrf: "uwu", isMobile: "false" }, (isMovie ? {} : { season: String(season), episode: String(episode) })));
        console.log(baseurl + `api/episodes/${id}/servers?${params}`);
        var { data } = yield (yield fetch(baseurl + `api/episodes/${id}/servers?${params}`, {
            headers: headers,
        })).json();
        let hash = data.find((source) => source.name === "UpCloud").hash;
        console.log(baseurl + "api/source/" + hash, Object.assign(Object.assign({}, headers), { Referer: `${baseurl}upcloud/e/${hash}?init=true&key=${v}` }));
        const source = yield (yield fetch(baseurl + "api/source/" + hash, {
            headers: Object.assign(Object.assign({}, headers), { Referer: `${baseurl}upcloud/e/${hash}?init=true&key=${v}` }),
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
exports.default = getSource;
// faild  TypeError: Cannot read properties of null (reading '1')
//     at <anonymous> (/vercel/path1/src/vidsrc.ts:28:38)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
