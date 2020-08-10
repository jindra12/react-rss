import React from "react";
import WeatherDisplay from "./WeatherDisplay";
import ReactDOM from "react-dom";

interface State {
    value: string;
    apiKey: string;
}

const today = new Date();
const fourDaysFromNow = new Date();
fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 4);

class TestWeather extends React.Component<{}, State> {
    state: State = {
        value: '',
        apiKey: '',
    }
    public render() {
        const { state } = this;
        return (
            <div>
                <input value={state.value} onInput={e => this.setState({ value: (e.target as HTMLInputElement).value })} />
                <button onClick={() => this.setState(prevState => ({ apiKey: prevState.value }))}>Test component</button>
                {state.apiKey && (
                    <WeatherDisplay 
                        apiKey={state.apiKey}
                        label="Cloudy weather measurements"
                        query={['clouds', 'cloudy']}
                        by="hour"
                        loadingComponent={() => <div>Loading...</div>}
                        errorComponent={props => {
                            console.error(props.error);
                            return <div>Error!</div>
                        }}
                        geo
                        updateGeo={1} // Updates every minute
                        setup={forecast => forecast
                            .at(today, fourDaysFromNow)
                            .units('metric')
                            .language('cz')}
                    />
                )}
            </div>
        );
    }
}

ReactDOM.render(
    <TestWeather />,
    document.getElementById("root"),
);