import React, { Component } from 'react';
import rssEnhancer, { InjectionRSSProps } from 'react-rss';

class SourcedRSSComponent extends Component<{ label: string } & InjectionRSSProps<{ hasImage: boolean }, { encoded?: string }>> {
    public render() {
        const { props } = this;
        return (
            <div>
                <h2>{props.label}</h2>
                <a href={props.rss.header.link}>
                    {props.rss.header.title}
                    {props.rss.header.hasImage && ' Has image!'}
                </a>
                <ul>
                    {props.rss.items.map(item => (
                        <li>
                            {item.description}.
                            {item.encoded && <span>Encoded: {item.encoded}</span>}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
};

export default rssEnhancer(
    SourcedRSSComponent,
    null,
    url => ({ input: url, init: { keepalive: false } }),
    (rss, header) => {
        return { ...header, hasImage: Boolean(rss.querySelector('image')) };
    },
    (rssItem, item) => {
        const contentEncoded = rssItem.querySelector('content\\:encoded')?.textContent;
        if (contentEncoded) {
            return { ...item, encoded: contentEncoded };
        }
        return item;
    }
);