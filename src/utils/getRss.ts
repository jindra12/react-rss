import { parseXml } from "./parseXml";
import { Standard2RSSFormat, Standard2RSSFormatItem, Standard2RSSFormatHeader } from "../types";

export const getRss = async <T, E>(
    enhanced: { input: RequestInfo, init?: RequestInit },
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    headerEnhancer?: (rssElement: Element, standard: Standard2RSSFormatHeader) => T & Standard2RSSFormatHeader,
    itemEnhancer?: (item: Element, standard: Standard2RSSFormatItem) => E & Standard2RSSFormatItem,
): Promise<Standard2RSSFormat & { header: T } & { items: E[] }> => {
    if (!fetch) {
        throw Error('Cannot find any fetch function!');
    }
    const result = await fetch(enhanced.input, enhanced.init);
    const xml = await result.text();
    return parseXml(xml, headerEnhancer, itemEnhancer);
};