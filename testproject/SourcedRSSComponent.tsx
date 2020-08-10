import React, { Component } from 'react';
import rssEnhancer, { InjectionRSSProps } from 'react-rss';

class SourcedRSSComponent extends Component<{ label: string } & InjectionRSSProps> {
    public render() {
        const { props } = this;
        return (
            <div>
                <h2>{props.label}</h2>
                <a href={props.rss.header.link}>
                    {props.rss.header.title}
                </a>
                <ul>
                    {props.rss.items.map(item => (
                        <li>
                            {item.description}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
};

export default rssEnhancer(
    SourcedRSSComponent
);