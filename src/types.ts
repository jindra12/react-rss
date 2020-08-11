export interface Standard2RSSFormat {
    header: Standard2RSSFormatHeader;
    items: Standard2RSSFormatItem[];
}

export interface InjectionRSSProps<T = {}> {
    /**
     * Formatted RSS2 standard feed
     */
    rss: Standard2RSSFormat & T;
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
    errorComponent?: (props: { error: any, contents: Standard2RSSFormat | null }) => JSX.Element;
}

export interface RSSProps<T = {}> extends InjectionRSSUrlProps {
    requestEnhancer?: (url: string) => ({ input: RequestInfo, init?: RequestInit });
    responseEnhancer?: (rssElement: Element, standard: Standard2RSSFormat) => T & Standard2RSSFormat
    children: (rss: Standard2RSSFormat & T) => JSX.Element | null;
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
