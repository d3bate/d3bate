import {observer} from "mobx-react";
import React from "react";
import {calendar} from "../sync/models/calendar";
import {debatingClub} from "../sync/models/club";
import {Redirect} from "react-router-dom";
import {firebase} from "../sync";
import * as moment from "moment";
import {Button, Card, minorScale, TextInput, Select} from "evergreen-ui";

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
        this.getDay = this.getDay.bind(this);
    }

    getDay() {
        return moment(this.state.year + '-' + (this.state.month - 1) + '-' + this.state.day, 'YYYY-MM-DD').format('dddd');
    }

    render() {
        if (this.state.edit)
            return <>
                <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)}
                      margin={minorScale(3)}>
                    <form>
                        <Select value={this.state.type} onChange={(event) => {
                            this.setState({type: event.target.value})
                        }}>

                            {eventTypes.map((eventType, index) => {
                                return <option value={eventType} key={index}>{eventType}</option>
                            })}

                        </Select>
                        <br/>
                        <TextInput type="number" value={this.state.year} className="authInput" onChange={(event) => {
                            this.setState({year: event.target.value})
                        }}/>
                        <br/>
                        <TextInput type="number" className="authInput" value={this.state.month} onChange={(event) => {
                            this.setState({month: event.target.value})
                        }} min={1} max={12}/>
                        <br/>
                        <TextInput type="number" className="authInput" value={this.state.day} onChange={(event) => {
                            this.setState({day: event.target.value})
                        }} min={1} max={31}/>
                        <br/>
                        <Button intent="success" margin={minorScale(3)} iconAfter="tick-circle">
                            Save
                        </Button>
                        <Button iconAfter="ban-circle" intent="danger" onClick={(event) => {
                            event.preventDefault();
                            this.setState({edit: false})
                        }
                        }>Cancel changes
                        </Button>
                    </form>

                </Card>
            </>;
        else
            return <>
                <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)}>
                    <p>Event type: {this.state.type}</p>
                    <p>On: {this.getDay()}</p>
                    <p>Date: {this.state.year}/{this.state.month}/{this.state.day}</p>
                    <Button iconAfter="edit" className="authSubmit" onClick={(event) => {
                        event.preventDefault();
                        this.setState({edit: true})
                    }
                    }>Edit
                    </Button>
                </Card>
            </>
    }
});

class AddEvent extends React.Component {
    constructor(props) {
        super(props);
        let date = new Date();
        this.state = {
            type: eventTypes[0],
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(event) {
        event.preventDefault();
        firebase.firestore().collection('calendar').add({
            clubID: debatingClub.club.clubID,
            startTime: moment(this.state.year + '-' + this.state.month + '-' + this.state.day, 'YYYY-MM-DD').toDate(),
            type: this.state.type
        })
    }

    render() {
        return <Card marginTop={'10px'} background="#E4E7EB" elevation={2} padding={minorScale(3)}
                     marginBottom={'10px'}>
            <h6>Add event</h6>
            <form onSubmit={this.submitForm}>
                <label>Event type: </label>
                <Select onChange={(event) => {
                    this.setState({type: event.target.value})
                }} value={this.state.type}>
                    {eventTypes.map((eventType, index) => {
                        return <option value={eventType} key={index}>{eventType}</option>
                    })}
                </Select>
                <br/>
                <label>Year:</label>
                <TextInput type="number" value={this.state.year} onChange={(event) => {
                    this.setState({year: event.target.value})
                }} margin={minorScale(3)}/>
                <br/>
                <label>Month: </label>
                <TextInput type="number" value={this.state.month} onChange={(event) => {
                    this.setState({month: event.target.value})
                }} min={1} max={12} margin={minorScale(3)}/>
                <br/>
                <label>Day: </label>
                <TextInput type="number" value={this.state.day} onChange={(event) => {
                    this.setState({day: event.target.value})
                }} min={1} max={31} margin={minorScale(3)}/>
                <br/>
                <Button height={minorScale(10)} margin={minorScale(3)} iconAfter="tick-circle">
                    Add event to calendar.
                </Button>
            </form>
        </Card>
    }
}

const EditCalendar = observer(class EditCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: this.props.match.match.params,
        };
    }

    filterCalendar() {
        return calendar.events.filter(o => {
            let date = moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + 1, 'YYYY-MM-DD');
            let eventDate = new Date(o.startTime.seconds * 1000);
            return eventDate > date.toDate() && eventDate < date.add(1, 'month').toDate();
        })
    }

    render() {
        if (!JSON.parse(localStorage.getItem('user'))) {
            return <Redirect to='/login'/>
        }
        return <div className="container">
            {this.filterCalendar().map((event, index) => {
                let date = new Date(event.startTime.seconds * 1000);
                return <ViewEvent type={event.type} year={date.getFullYear()} month={date.getMonth() + 1}
                                  day={date.getDate()} key={index}/>
            })}

            <AddEvent/>
        </div>

    }
});

export {EditCalendar}
