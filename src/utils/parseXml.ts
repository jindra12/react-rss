import { Standart2RSSFormat, Standart2RSSFormatItem } from "../types";

const getFromChannel = (channel: Element, query: string) => channel.querySelector(query)?.textContent || '';
const HTMLCollectionArray = (collection: HTMLCollectionOf<Element>) => {
    const acc: Element[] = [];
    for (let i = 0; i < collection.length; i++) {
        acc.push(collection.item(i)!);
    }
    return acc;
}

export const parseXml = (
    xml: string,
): Standart2RSSFormat => {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    try {
        const channel = doc.querySelector('rss')!.querySelector('channel')!;
        const image = channel.querySelector('image');
        const rss: Standart2RSSFormat = {
            header: {
                blogChannel: {
                    blink: getFromChannel(channel, 'blogChannel:blink'),
                    blogRoll: getFromChannel(channel, 'blogChannel:blogRoll'),
                    mySubscriptions: getFromChannel(channel, 'blogChannel:mySubscriptions'),
                },
                category: {
                    category: getFromChannel(channel, 'category'),
                    domain: channel.querySelector('category')?.getAttribute('domain') || '',
                },
                copyright: getFromChannel(channel, 'copyright'),
                description: getFromChannel(channel, 'description'),
                docs: getFromChannel(channel, 'docs'),
                generator: getFromChannel(channel, 'generator'),
                image: image ? {
                    height: getFromChannel(image, 'height'),
                    link: getFromChannel(image, 'link'),
                    title: getFromChannel(image, 'title'),
                    url: getFromChannel(image, 'url'),
                    width: getFromChannel(image, 'width')
                } : undefined,
                language: getFromChannel(channel, 'language'),
                lastBuildDate: getFromChannel(channel, 'lastBuildDate'),
                link: getFromChannel(channel, 'link'),
                managingEditor: getFromChannel(channel, 'managingEditor'),
                title: getFromChannel(channel, 'title'),
                ttl: getFromChannel(channel, 'ttl'),
                webMaster: getFromChannel(channel, 'webMaster'),
            },
            items: HTMLCollectionArray(channel.getElementsByTagName('item')).map((item): Standart2RSSFormatItem => {
                const enclosure = item.querySelector('enclosure');
                const source = item.querySelector('source');
                return {
                    author: getFromChannel(item, 'author'),
                    category: getFromChannel(item, 'category'),
                    comments: getFromChannel(item, 'comments'),
                    description: getFromChannel(item, 'description'),
                    guid: getFromChannel(item, 'guid'),
                    link: getFromChannel(item, 'link'),
                    pubDate: getFromChannel(item, 'pubDate'),
                    title: getFromChannel(item, 'title'),
                    enclosure: enclosure ? {
                        length: enclosure.getAttribute('length') || '',
                        type: enclosure.getAttribute('type') || '',
                        url: enclosure.getAttribute('url') || '',
                    } : undefined,
                    source: source ? {
                        source: source.textContent || '',
                        url: source.getAttribute('url') || '',
                    } : undefined,
                };
            }),
        };
        return rss;
    } catch (e) {
        throw `Failed to parse RSS! Most likely a malformed field. Exception: ${JSON.stringify(e)}`;
    }
};
