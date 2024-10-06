//vidsrc.cc/v2/embed/tv/124364/1/5

import { Provider, Source } from "../utils/types";

class Upcloud extends Provider {
  baseUrl = "https://vidsrc.cc/";
  headers = {
    Referer: this.baseUrl,
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  };
  async getSource(
    id: string,
    isMovie: boolean,
    season?: string,
    episode?: string
  ): Promise<Source> {
    try {
      const mediaurl =
        this.baseUrl +
        "v2/embed/" +
        (isMovie ? `movie/${id}` : `tv/${id}/${season}/${episode}`);
      console.log(mediaurl);

      const [title, movieId, v] = await (
        await fetch(mediaurl, {
          headers: {
            ...this.headers,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            Connection: "keep-alive",
            "Sec-Fetch-Dest": "document",
          },
        })
      )
        .text()
        .then((resp) => {
          console.log(resp.match(/<title>(.*?)<\/title>/)![1]);
          return [
            resp.match(/<title>(.*?)<\/title>/)![1],
            resp.match(/data-id="(.*?)"/g)![1].split('"')[1],
            resp.match(/var\s*v\s*=\s*"(.*?)"/)![1],
          ];
        });
      const params: URLSearchParams = new URLSearchParams({
        id: String(id),
        type: isMovie ? "movie" : "tv",
        v: String(v),
        vrf: "uwu",
        isMobile: "false", // Convert boolean to string
        ...(isMovie
          ? {}
          : { season: String(season), episode: String(episode) }), // Ensure season and episode are strings if they're defined
      });
      console.log(this.baseUrl + `api/episodes/${id}/servers?${params}`);
      var { data } = await (
        await fetch(this.baseUrl + `api/episodes/${id}/servers?${params}`, {
          headers: this.headers,
        })
      ).json();

      let hash = data.find(
        (source: { name: string }) => source.name === "UpCloud"
      ).hash;

      console.log(this.baseUrl + "api/source/" + hash, {
        ...this.headers,
        Referer: `${this.baseUrl}upcloud/e/${hash}?init=true&key=${v}`,
      });

      const source = await (
        await fetch(this.baseUrl + "api/source/" + hash, {
          headers: {
            ...this.headers,
            Referer: `${this.baseUrl}upcloud/e/${hash}?init=true&key=${v}`,
          },
        })
      ).json();
      console.log(source);
      // return title;
      return { title, ...source };
    } catch (error) {
      console.log("faild ", error);
      throw error;
    }
  }
}

export default Upcloud;

// faild  TypeError: Cannot read properties of null (reading '1')
//     at <anonymous> (/vercel/path1/src/vidsrc.ts:28:38)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
