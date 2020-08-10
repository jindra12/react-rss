import { parseXml } from "./parseXml";

export const getRss = async (
    url: string,
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
) => {
    if (!fetch) {
        throw Error('Cannot find any fetch function!');
    }
    const result = await fetch(url);
    const xml = await result.text();
    return parseXml(xml);
};