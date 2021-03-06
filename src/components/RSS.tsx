import React, { Component } from 'react';
import { Standard2RSSFormat, InjectionRSSProps, InjectionRSSUrlProps, RSSProps, Standard2RSSFormatItem, Standard2RSSFormatHeader } from '../types';
import { getRss } from '../utils/getRss';

interface RSSState {
    contents: Standard2RSSFormat | null;
    loading: boolean;
    error?: any;
}

const enhanceUrl = (url: string, requestEnhancer?: (url: string) => {
    input: RequestInfo,
    init?: RequestInit,
}): {
    input: RequestInfo,
    init?: RequestInit,
} => requestEnhancer ? requestEnhancer(url) : { input: url };

class RSS extends Component<RSSProps, RSSState> {
    interval: number | null = null;
    state: RSSState = {
        contents: null,
        loading: false,
    };
    public async componentDidMount() {
        this.sendRequest();
    }
    public componentDidUpdate(prevProps: RSSProps) {
        const { props } = this;
        if (prevProps.subscribe !== props.subscribe || prevProps.url !== props.url) {
            this.clearInterval();
            this.sendRequest();
        }
    }
    public componentWillUnmount() {
        this.clearInterval();
    }

    public render() {
        const { state, props } = this;
        if (state.loading) {
            if (props.loadingComponent) {
                const Loader = props.loadingComponent;
                return <Loader />;
            }
        } else if (state.error) {
            if (props.errorComponent) {
                const Error = props.errorComponent;
                return <Error contents={state.contents} error={state.error} />
            }
        } else if (state.contents) {
            return props.children(state.contents);
        }
        return null;
    }

    private clearInterval = () => {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    private getRss = async () => {
        const { props } = this;
        const enhanced = enhanceUrl(props.url!, props.requestEnhancer);
        const contents = await getRss(enhanced, window.fetch, props.headerEnhancer, props.itemEnhancer);
        return contents;
    }

    private sendRequest = async () => {
        const { props } = this;
        this.setState({ loading: true });
        try {
            if (!props.url) {
                throw Error('Cannot set up rss feed of nonexistent url!');
            }
            const contents = await this.getRss();
            this.setState({ contents, loading: false, error: null });
            if (props.subscribe) {
                this.setupSubscription(contents);
            }
        } catch (e) {
            this.setState({ error: e, loading: false });
        }
    }

    private setupSubscription = (contents: Standard2RSSFormat) => {
        const { props } = this;
        const subscription = parseInt(contents.header.ttl, 10);
        this.interval = window.setInterval(
            async () => {
                try {
                    if (!props.url) {
                        throw Error('Cannot set up rss feed of nonexistent url!');
                    }
                    this.setState({ loading: true });
                    const contents = await this.getRss(); 
                    this.setState({ contents, loading: false, error: null });
                } catch (e) {
                    this.setState({ error: e, loading: false });
                }
            },
            (isNaN(subscription) ? 10 : subscription) * 60 * 1000,
        );
    }
}

/**
 * Higher-order component enhancer for rss feed
 * @param Component Component to enhance
 * @param url Static url from which to draw
 * @param requestEnhancer You can use this to statically enhance requests by setting request headers, method etc.
 * @param headerEnhancer Use this function to add properties to resulting rss object. You can use standard media queries on rssElement to do so.
 * @param itemEnhacer Use this to enhance individual news from feed. You can use standard media queries on item to do so.
 */
export const rssEnhancer = <T, E extends (string | null) = null>(
    Component: ((props: T & InjectionRSSProps) => JSX.Element | null) | (new (props: T & InjectionRSSProps) => React.Component<T & InjectionRSSProps>),
    url: E = null as any,
    requestEnhancer?: (url: string) => ({ input: RequestInfo, init?: RequestInit }),
    headerEnhancer?: <F extends Standard2RSSFormatHeader>(header: any, standard: Standard2RSSFormatHeader) => F | Standard2RSSFormatHeader,
    itemEnhancer?: <K extends Standard2RSSFormatItem>(item: any, standard: Standard2RSSFormatItem) => K | Standard2RSSFormatItem,
) => (props: Omit<T, 'rss'> & InjectionRSSUrlProps) => {
    return (
        <RSS
            url={(props.url || url) as any}
            loadingComponent={props.loadingComponent}
            errorComponent={props.errorComponent}
            requestEnhancer={requestEnhancer}
            headerEnhancer={headerEnhancer}
            itemEnhancer={itemEnhancer}
        >
            {rss => (
                <Component {...props as any} rss={rss} />
            )}
        </RSS>
    );
};