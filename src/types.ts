export interface Standart2RSSFormat {
    header: Standart2RSSFormatHeader;
    items: Standart2RSSFormatItem[];
}

export interface InjectionRSSProps {
    rss: Standart2RSSFormat;
}

export interface InjectionRSSUrlProps {
    url: string;
    subscribe?: boolean;
}

export interface RSSProps extends InjectionRSSUrlProps {
    loader?: () => JSX.Element;
    error?: (props: { error: any, contents: Standart2RSSFormat | null }) => JSX.Element;
    children: (rss: Standart2RSSFormat) => JSX.Element | null;
}

export interface Standart2RSSFormatHeader {
    title: string;
    image?: {
        url: string;
        title: string;
        link: string;
        width: string;
        height: string;
    },
    link: string;
    description: string;
    language: string;
    blogChannel: {
        blogRoll: string;
        mySubscriptions: string;
        blink: string;
    }
    copyright: string;
    lastBuildDate: string;
    docs: string;
    generator: string;
    category: {
        domain: string;
        category: string;
    }
    managingEditor: string;
    webMaster: string;
    ttl: string;
}

export interface Standart2RSSFormatItem {
    description: string;
    pubDate: string;
    guid: string;
    title: string;
    link: string;
    author: string;
    category: string;
    comments: string;
    enclosure?: {
        url: string;
        length: string;
        type: string;
    },
    source?: {
        url: string;
        source: string;
    }
}
