export abstract class Provider {
  abstract getSource(
    id: string,
    isMovie: boolean,
    season?: string,
    episode?: string
  ): Promise<Source | any>;
}
export interface Source {
  url: string;
  qualities?: { url: string; quality: string }[];
  referer: string;
  captions?: { url: string; language: string }[];
}
export type DecryptMethods = {
  [key: string]: (inputString: string) => string;
};
