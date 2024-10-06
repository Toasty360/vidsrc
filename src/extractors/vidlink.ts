import crypto from "crypto";
import { DecryptMethods, Provider, Source } from "../utils/types";
import { json } from "stream/consumers";

class Vidlink extends Provider {
  baseURL = "https://vidlink.pro/api/";
  private key = Buffer.from(
    "9f8dff95f42e0b9823f16bef28d2ca76063ab987ddd1f69718638f280db2df45",
    "hex"
  );
  private algorithm = "aes-256-cbc";
  private _cryptoMethods: DecryptMethods = {
    encodeID: (data: string): string => {
      let iv = crypto.randomBytes(16);
      console.log(iv.buffer);

      let cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      let encrypted = Buffer.concat([
        cipher.update(data, "utf8"),
        cipher.final(),
      ]);
      return iv.toString("hex") + ":" + encrypted.toString("hex");
    },
    decodeID: (encrypted: string): string => {
      let parts = encrypted.split(":");
      let iv = Buffer.from(parts.shift() as string, "hex");
      let encryptedText = Buffer.from(parts.join(":"), "hex");

      let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      return decrypted.toString();
    },
    decrypt: (encrypted: string): string => {
      let parts = encrypted.split(":");
      let iv = Buffer.from(parts.shift() as string, "hex");
      let encryptedText = Buffer.from(parts.join(":"), "hex");

      let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      return decrypted.toString();
    },
  };

  getSource = async (
    id: string,
    isMovie: boolean,
    season?: string,
    episode?: string
  ): Promise<Source | any> => {
    const encoded = this._cryptoMethods.encodeID(id);
    const endpoint = isMovie
      ? `movie/${encoded}`
      : `tv/${encoded}/${season}/${episode}`;
    const response = await (await fetch(this.baseURL + endpoint)).text();
    const link = this._cryptoMethods.decrypt(response);
    return JSON.parse(link);
  };
}
export default Vidlink;
