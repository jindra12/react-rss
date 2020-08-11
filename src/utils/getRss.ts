import { parseXml } from "./parseXml";
import { Standard2RSSFormat } from "../types";

export const getRss = async <T>(
    enhanced: { input: RequestInfo, init?: RequestInit },
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    responseEnhancer?: (rssElement: Element, standard: Standard2RSSFormat) => T & Standard2RSSFormat,
): Promise<T & Standard2RSSFormat> => {
    if (!fetch) {
        throw Error('Cannot find any fetch function!');
    }
    const result = await fetch(enhanced.input, enhanced.init);
    const xml = await result.text();
    return parseXml(xml, responseEnhancer);
};