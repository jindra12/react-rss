import React, { Component } from 'react';
import { Standart2RSSFormat, InjectionRSSProps, InjectionRSSUrlProps, RSSProps } from '../types';
import { getRss } from '../utils/getRss';

interface RSSState {
    contents: Standart2RSSFormat | null;
    loading: boolean;
    error?: any;
}

class RSS extends Component<RSSProps, RSSState> {
    interval: number | null = null;
    state: RSSState = {
        contents: null,
        loading: false,
    };
    public async componentDidMount() {
        const { props } = this;
        this.setState({ loading: true });
        try {
            const contents = await getRss(props.url, window.fetch);
            this.setState({ contents, loading: false, error: null });
            if (props.subscribe) {
                const subscription = parseInt(contents.header.ttl, 10);
                this.interval = window.setInterval(
                    async () => {
                        try {
                            this.setState({ loading: true });
                            const contents = await getRss(props.url, window.fetch);
                            this.setState({ contents, loading: false, error: null });  
                        } catch (e) {
                            this.setState({ error: e, loading: false });
                        }
                    },
                    (isNaN(subscription) ? 10 : subscription) * 60 * 1000,
                )   
            }
        } catch (e) {
            this.setState({ error: e, loading: false });
        }
    }
    public componentWillUnmount() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    public render() {
        const { state, props } = this;
        if (state.loading) {
            if (props.loader) {
                const Loader = props.loader;
                return <Loader />;
            }
        } else if (state.error) {
            if (props.error) {
                const Error = props.error;
                return <Error contents={state.contents} error={state.error} />
            }
        } else if (state.contents) {
            return props.children(state.contents);
        }
        return null;
    }
}

export const rssEnhancer = <T, E extends (string | null) = null>(
    Component: ((props: T & InjectionRSSProps) => JSX.Element | null) | (new (props: T & InjectionRSSProps) => JSX.Element | null),
    url: E = null as any,
    loader?: () => JSX.Element,
    error?: (props: { error: any, contents: Standart2RSSFormat | null }) => JSX.Element,
) => (props: Omit<T, 'rss'> & (E extends null ? InjectionRSSUrlProps : InjectionRSSUrlProps & { url: undefined })) => {
    return (
        <RSS
            url={(props.url || url) as any}
            loader={loader}
            error={error}
        >
            {rss => (
                <Component {...props as any} rss={rss} />
            )}
        </RSS>
    );
};