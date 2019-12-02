import React from 'react';
import {Redirect} from "react-router-dom";
import {firebase} from "../sync";


class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: this.props.match.match.params,
            events: null
        };

        let weeks = [];
        let day = 1;

        for (let i = 0; i < 4; i++) {
            let days = [];
            for (let j = 0; j < 7; j++) {
                days.push(day);
                day += 1
            }
            weeks.push(days);
        }
        this.state.weeks = weeks;
        this.loadEvents = this.loadEvents.bind(this);
        this.loadEvents()
            .then()
    }

    async loadEvents() {
        let docs = await firebase.firestore().collection('calendar')
            .where('startTime', '>', new Date(this.state.params.year + '-' + this.state.params.month + '-' + 1))
            .where('startTime', '<', new Date(this.state.params.year + '-' + (this.state.params.month + 1) + '-' + 1))
            .get();
        this.setState({events: docs})
    }

    findEvent(day) {
        for (let event of this.state.events.docs) {
            if (new Date(event.data().startTime.seconds * 1000).getDate() === day) {
                return event;
            }
        }

        return false;
    }

    render() {
        if (!JSON.parse(localStorage.getItem('user'))) {
            return <Redirect to='/login'/>
        }
        if (!this.state.events) {
            return <h1>Loading data</h1>
        }
        return <div className='calendarContainer'>
            <h1>The calendar</h1>
            <h3>Month {this.state.params.month} of {this.state.params.year}</h3>
            {this.state.weeks.map((week, weekIndex) => {

                return <>
                    <div className='calendarRowWeek' key={weekIndex}>
                        {week.map((day, dayIndex) => {
                            let foundEvent = this.findEvent(day);
                            return <div className='calendarColumnDay' key={dayIndex}>
                                <p className="boldText">
                                    {day}
                                </p>
                                {foundEvent ? <p>{foundEvent.data().type}</p> : null}
                            </div>
                        })}
                    </div>
                    <hr className='calendarLineBreak'/>
                </>
            })}
        </div>
    }
}

class EditCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null
        };
        this.loadEvents = this.loadEvents.bind(this);
        this.loadEvents()
            .then()
    }

    async loadEvents() {
        let docs = await firebase.firestore().collection('calendar')
            .where('startTime', '>', new Date(this.state.params.year + '-' + this.state.params.month + '-' + 1))
            .get();
        this.setState({events: docs})
    }

    render() {
        if (this.events) {

        }
        return <>
        </>
    }
}


export {Calendar}