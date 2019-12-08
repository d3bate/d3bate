import {observer} from "mobx-react";
import React from "react";
import {appState} from "../sync/models";
import {Redirect} from "./Calendar";

const eventTypes = [
    'training', 'tournament', 'friendly'
];

const ViewEvent = observer(class ViewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            year: this.props.year,
            month: this.props.month,
            day: this.props.day,
            edit: false
        };
        this.updateType = this.updateType.bind(this);
        this.updateYear = this.updateYear.bind(this);
    }

    updateType(event) {
        this.setState({type: event.target.value})
    }

    updateYear(event) {
        this.setState({year: event.target.value})
    }


    render() {
        return <>
            <div>
                <form>
                    <select value={this.state.type} onChange={this.updateType}>
                        {eventTypes.map((eventType, index) => {
                            return <option value={eventType} key={index}>{eventType}</option>
                        })}
                    </select>
                    <input type="number" value={this.state.year} onChange={this.updateYear} min={1} max={12}/>
                </form>
            </div>
        </>
    }
});


const EditCalendar = observer(class EditCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: this.props.match.match.params,
            newDoc: {},
        };
    }

    render() {
        if (!appState.user) {
            return <Redirect to='/login'/>
        }
        return <div>

        </div>

    }
});

export {EditCalendar}
