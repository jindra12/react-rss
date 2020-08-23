# react-rss

Higher order component capable of injecting RSS feed from any url into props.


So far this feed only supports standard RSS params defined in: https://validator.w3.org/feed/docs/rss2.html.

## Example of usage

### Display component enhanced with react-rss

```JSX

import React, { FunctionComponent } from 'react';
import rssEnhancer, { InjectionRSSProps } from 'react-rss';

const DefaultRSSComponent: FunctionComponent<{ label: string } & InjectionRSSProps> = props => (
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

export default rssEnhancer(
    DefaultRSSComponent,
    'https://techbeacon.com/rss.xml',
);

```

### Component enhanced with react-rss

```JSX

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

```

### Resulting use

```JSX

import React from "react";
import ReactDOM from "react-dom";
import DefaultRSSComponent from "./DefaultRSSComponent";
import SourcedRSSComponent from "./SourcedRSSComponent";

interface State {
    value: string;
    rssUrl: string;
}

class TestRSS extends React.Component<{}, State> {
    state: State = {
        value: '',
        rssUrl: '',
    }
    public render() {
        const { state } = this;
        return (
            <div>
                <input value={state.value} onInput={e => this.setState({ value: (e.target as HTMLInputElement).value })} />
                <button onClick={() => this.setState(prevState => ({ rssUrl: prevState.value }))}>Test component</button>
                {state.rssUrl && (
                    <SourcedRSSComponent
                        url={state.rssUrl}
                        subscribe={true}
                        label="Sourced"
                        loadingComponent={() => <div>Loading sourced</div>}
                        errorComponent={e => {
                            console.error(e);
                            return <div>Failed to load this resource!</div>;
                        }}
                    />
                )}
                <DefaultRSSComponent
                    label="Default"
                    loadingComponent={() => <div>Loading default..</div>}
                    errorComponent={() => <div>Sadly, no default rss :(</div>}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <TestRSS />,
    document.getElementById("root"),
);

```

### Changes since 1.0.0

Fixed typos in typings of this package. Added enhancers, which allow you to pick custom xml elements (using query selectors) out of RSS and add them to the component props.


Also, fixed default parsing of RSS XML document and added component update mechanism when passed url changes.

#### Example of use

```JSX

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
    null, // Default url is null, which means resulting component will need an url passed in its props.
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

```

## Changes since 2.0.0

Added no-dependency parser of xml into a JSON object. The parser can handle attributes, children in xml and text/c-data nodes.


For a simple example, see above. This parser stores child nodes under 'children' property. Children will either be objects or arrays, depending on whether there are duplicate children with the same tag name. Parsed attributes will be stored inside 'attributes' property. Text/c-data nodes will be stored under 'text' property and will be concatenated.


This was done to simplify object access inside enhancers.

## Addendum

You can either setup an URL in the enhancer, or in the resulting component. However, the url has to be set. You can rewrite default url with the one on component.

## Footer

If you have any ideas on how to improve this package, do not hesitate to file in a pull request or an issue on github.
