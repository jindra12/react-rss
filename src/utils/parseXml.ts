import { Standard2RSSFormat, Standard2RSSFormatItem, Standard2RSSFormatHeader } from "../types";
import { parseToJson } from "./parseToJson";

export const parseXml = <T, E>(
    xml: string,
    enhancer?: (header: any, standard: Standard2RSSFormatHeader) => T & Standard2RSSFormatHeader,
    itemEnhancer?: (item: any, standard: Standard2RSSFormatItem) => E & Standard2RSSFormatItem,
): Standard2RSSFormat & { header: T } & { items: E[] } => {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    try {
        const channel = doc.querySelector('rss')!.querySelector('channel');
        const json = parseToJson(channel!);
        const rss: Standard2RSSFormat = {
            header: {
                title: json.title?.text || '',
                category: {
                    category: json.category?.text || '',
                    domain: json.category?.attributes?.domain || '',
                },
                copyright: json.copyright?.text || '',
                description: json.description?.text || '',
                docs: json.docs?.text || '',
                generator: json.generator?.text || '',
                language: json.language?.text || '',
                lastBuildDate: json.lastBuildDate?.text || '',
                link: json.link?.text || '',
                managingEditor: json.managingEditor?.text || '',
                ttl: json.ttl?.text || '',
                webMaster: json.webMaster?.text || '',
                image: json.image ? {
                    height: json.image.children?.height || '',
                    link: json.image.children?.link || '',
                    title: json.image.children?.title || '',
                    url: json.image.children?.url || '',
                    width: json.image.children?.width || '',
                } : undefined,
            },
            items: json.item.map((item: any): Standard2RSSFormatItem & E => {
                const enclosure = item.children?.enclosure || '';
                const source = item.children?.source || '';
                const result = {
                    author: item.children?.author?.text || '',
                    category: item.children?.category?.text || '',
                    comments: item.children?.comments?.text || '',
                    description: item.children?.description?.text || '',
                    guid: item.children?.guid?.text || '',
                    link: item.children?.link?.text || '',
                    pubDate: item.children?.pubDate?.text || '',
                    title: item.children?.title?.text || '',
                    enclosure: enclosure ? {
                        length: enclosure.attributes?.length || '',
                        type: enclosure.attributes?.type || '',
                        url: enclosure.attributes?.url || '',
                    } : undefined,
                    source: source ? {
                        source: source.text || '',
                        url: source.attributes?.url || '',
                    } : undefined,
                };
                if (itemEnhancer) {
                    return itemEnhancer(item.children, result);
                }
                return result as any;
            }), 
        };
        if (enhancer) {
            return { header: enhancer(json, rss.header), items: rss.items as any };
        }
        return rss as any;
    } catch (e) {
        console.error(e.message);
        throw 'Failed to parse RSS! Most likely a malformed field.';
    }
};
