import { Provider, Source } from "../utils/types";
import cryptoJs from "crypto-js";

export class MovieApi extends Provider {
  baseUrl = "https://moviesapi.club/";
  secretKey = "1FHuaQhhcsKgpTRB";

  decrypt = (jsonStr: string, password: string) => {
    return JSON.parse(
      cryptoJs.AES.decrypt(jsonStr, password, {
        format: {
          parse: (json: string) => {
            const j = JSON.parse(json);
            return cryptoJs.lib.CipherParams.create({
              ciphertext: cryptoJs.enc.Base64.parse(j.ct),
              iv: j.iv ? cryptoJs.enc.Hex.parse(j.iv) : undefined,
              salt: j.s ? cryptoJs.enc.Hex.parse(j.s) : undefined,
            });
          },
          stringify: (cipherParams: cryptoJs.lib.CipherParams) => {
            const jsonObj: any = {
              ct: cipherParams.ciphertext.toString(cryptoJs.enc.Base64),
            };
            if (cipherParams.iv)
              jsonObj.iv = cipherParams.iv.toString(cryptoJs.enc.Hex);
            if (cipherParams.salt)
              jsonObj.s = cipherParams.salt.toString(cryptoJs.enc.Hex);
            return JSON.stringify(jsonObj);
          },
        },
      }).toString(cryptoJs.enc.Utf8)
    );
  };

  async getSource(
    id: string,
    isMovie: boolean,
    season?: string,
    episode?: string
  ): Promise<Source | any> {
    try {
      const url = `${this.baseUrl}${
        isMovie ? `movie/${id}` : `tv/${id}-${season}-${episode}`
      }`;
      console.log(url);

      const iframe = await (
        await fetch(url, {
          headers: { Referer: this.baseUrl },
        })
      )
        .text()
        .then((data) => data.match(/<iframe.*src="(.*?)"/)?.[1]);
      if (!iframe) return "bruh iframe crashed";

      const jsonStr = (
        await (
          await fetch(iframe, { headers: { Referer: this.baseUrl } })
        ).text()
      ).match(/<script.*?'(.*?)'.*<\/script>/)?.[1];
      if (!jsonStr) return "jsonsstr nuked";
      const decryptedString = this.decrypt(jsonStr, this.secretKey);
      const sources = decryptedString.match(/sources\s*:\s*(\[.*?\])/)?.[1];
      const tracks = decryptedString.match(/tracks\s*:\s*(\[.*?\])/)?.[1];

      return sources && tracks
        ? {
            url: JSON.parse(sources),
            captions: JSON.parse(tracks),
            referer: this.baseUrl,
            source: "Movieapi.club",
          }
        : null;
    } catch (error) {
      console.error("Error fetching source:", error);
      return null;
    }
  }
}
