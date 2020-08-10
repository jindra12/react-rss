import { parseXml } from "./parseXml";

export const getRss = async (
    url: string,
    fetch: undefined | ((input: RequestInfo, init?: RequestInit) => Promise<Response>) = typeof window !== 'undefined' && typeof window.fetch !== 'undefined' 
        ? window.fetch
        : undefined,
) => {
    if (!fetch) {
        throw Error('Cannot find any fetch function!');
    }
    const result = await fetch(url);
    const xml = await result.text();
    return parseXml(xml);
};