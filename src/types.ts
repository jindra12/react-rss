export interface Standard2RSSFormat {
    header: Standard2RSSFormatHeader;
    items: Standard2RSSFormatItem[];
}

export interface InjectionRSSProps<T = {}, K = {}> {
    /**
     * Formatted RSS2 standard feed
     */
    rss: {
        header: T & Standard2RSSFormatHeader;
    } & {
        items: (K & Standard2RSSFormatItem)[];
    };
}

export interface InjectionRSSUrlProps {
    /**
     * Url of resource you want to load. Make sure CORS are set up right. You can either use this param or the default one exposed on enhancer.
     */
    url?: string;
    /**
     * Should the feed subscribe and refresh to a news interval using Time To Live param?
     */
    subscribe?: boolean;
    /**
     * Component to display when loading
     */
    loadingComponent?: () => JSX.Element;
    /**
     * Component to display for error state with last known contents
     */
    errorComponent?: <T extends Standard2RSSFormat = Standard2RSSFormat>(props: { error: any, contents: T | null }) => JSX.Element;
}

export interface RSSProps<T = {}, K = {}> extends InjectionRSSUrlProps {
    requestEnhancer?: (url: string) => ({ input: RequestInfo, init?: RequestInit });
    headerEnhancer?: (rssElement: Element, standard: Standard2RSSFormatHeader) => T & Standard2RSSFormatHeader;
    itemEnhancer?: (item: Element, standard: Standard2RSSFormatItem) => K & Standard2RSSFormatItem;
    children: (rss: Standard2RSSFormat & { header: T } & { items: K[] }) => JSX.Element | null;
}

export interface Standard2RSSFormatHeader {
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

export interface Standard2RSSFormatItem {
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
