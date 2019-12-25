import {observer} from "mobx-react";
import React from "react";
import {calendar} from "../sync/models/calendar";
import {debatingClub} from "../sync/models/club";
import {Redirect} from "react-router-dom";
import {firebase} from "../sync";
import * as moment from "moment";

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
                <div>
                    <form>
                        <select value={this.state.type} onChange={(event) => {
                            this.setState({type: event.target.value})
                        }}>

                            {eventTypes.map((eventType, index) => {
                                return <option value={eventType} key={index}>{eventType}</option>
                            })}

                        </select>

                        <input type="number" value={this.state.year} className="authInput" onChange={(event) => {
                            this.setState({year: event.target.value})
                        }}/>

                        <input type="number" className="authInput" value={this.state.month} onChange={(event) => {
                            this.setState({month: event.target.value})
                        }} min={1} max={12}/>

                        <input type="number" className="authInput" value={this.state.day} onChange={(event) => {
                            this.setState({day: event.target.value})
                        }} min={1} max={31}/>

                        <input type={'submit'}/>
                    </form>
                    <button className="authSubmit" onClick={(event) => {
                        event.preventDefault();
                        this.setState({edit: false})
                    }
                    }>Cancel changes
                    </button>
                </div>
            </>;
        else
            return <>
                <div className="card">
                    <p>{this.getDay()}</p>
                    <p>{this.state.year}/{this.state.month}/{this.state.day}</p>
                    <button className="authSubmit" onClick={(event) => {
                        event.preventDefault();
                        this.setState({edit: true})
                    }
                    }>Edit
                    </button>
                </div>
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
        return <div className="">
            <form onSubmit={this.submitForm}>
                <select onChange={(event) => {
                    this.setState({type: event.target.value})
                }} value={this.state.type}>
                    {eventTypes.map((eventType, index) => {
                        return <option value={eventType} key={index}>{eventType}</option>
                    })}
                </select>
                <input type="number" value={this.state.year} onChange={(event) => {
                    this.setState({year: event.target.value})
                }}/>
                <input type="number" value={this.state.month} onChange={(event) => {
                    this.setState({month: event.target.value})
                }} min={1} max={12}/>
                <input type="number" value={this.state.day} onChange={(event) => {
                    this.setState({day: event.target.value})
                }} min={1} max={31}/>
                <input type="submit"/>
            </form>
        </div>
    }
}

const EditCalendar = observer(class EditCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: this.props.match.match.params,
        };
    }

    render() {
        if (!JSON.parse(localStorage.getItem('user'))) {
            return <Redirect to='/login'/>
        }
        return <div className="container">

            {calendar.events.map((event, index) => {
                let date = new Date(event.startTime.seconds * 1000);
                return <ViewEvent type={event.type} year={date.getFullYear()} month={date.getMonth() + 1}
                                  day={date.getDate()} key={index}/>
            })}

            <AddEvent/>
        </div>

    }
});

export {EditCalendar}
