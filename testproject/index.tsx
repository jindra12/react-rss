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