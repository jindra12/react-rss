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
            if (!props.url) {
                throw Error('Cannot set up rss feed of nonexistent url!');
            }
            const contents = await getRss(props.url, window.fetch);
            this.setState({ contents, loading: false, error: null });
            if (props.subscribe) {
                const subscription = parseInt(contents.header.ttl, 10);
                this.interval = window.setInterval(
                    async () => {
                        try {
                            if (!props.url) {
                                throw Error('Cannot set up rss feed of nonexistent url!');
                            }
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
}

export const rssEnhancer = <T, E extends (string | null) = null>(
    Component: ((props: T & InjectionRSSProps) => JSX.Element | null) | (new (props: T & InjectionRSSProps) => React.Component<T & InjectionRSSProps>),
    url: E = null as any,
) => (props: Omit<T, 'rss'> & InjectionRSSUrlProps) => {
    return (
        <RSS
            url={(props.url || url) as any}
            loadingComponent={props.loadingComponent}
            errorComponent={props.errorComponent}
        >
            {rss => (
                <Component {...props as any} rss={rss} />
            )}
        </RSS>
    );
};