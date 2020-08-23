import React, { Component } from 'react';
import rssEnhancer, { InjectionRSSProps } from 'react-rss';

/**
 * Props injected have a two-type template: first is header enhancement, second one is with what is each item enhanced.
 */
class SourcedRSSComponent extends Component<{ label: string } & InjectionRSSProps<{ hasImage: boolean }, { mediaUrl?: string }>> {
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
                            {item.description}
                            {item.mediaUrl && <span>Url: {item.mediaUrl}</span>}
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
    url => ({ input: url, init: { method: 'POST' } }), // Enhances the used url request by any optional parameter, such as headers, method, etc.
    (rss, header) => { // Enhances header portion of result
        return { ...header, hasImage: Boolean(rss.image) };
    },
    (rssItem, item) => { // Enhances each item by json property
        const mediaUrl = rssItem['media:content'].attributes.url;
        if (mediaUrl) {
            return { ...item, mediaUrl };
        }
        return item;
    }
);