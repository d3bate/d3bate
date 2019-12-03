import React from 'react';
import {Redirect} from "react-router-dom";
import {Collection} from "../sync";
import {observer} from "mobx-react";

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            month: new Date().getMonth()
        }
    }

    render() {
        return <div className="DatePicker">
            <form className="DatePickerForm">
                <input type="" className="authInput"/>
                <input type="" className="authInput"/>
            </form>
        </div>
    }
}

const Calendar = observer(class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: this.props.match.match.params,
        };

        this._col = new Collection('calendar', {
            query: (ref) => ref.where('startTime', '>', new Date(this.state.params.year + '-' + this.state.params.month + '-' + 1))
        });

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
        this.findEvent = this.findEvent.bind(this);
    }

    findEvent(day) {
        let filteredDocs = this._col.docs.filter(doc => {
            return new Date(doc.data.startTime.seconds * 1000).getDate() === day;
        });

        if (!filteredDocs.length > 0) {
            filteredDocs = false;
        }
        return filteredDocs
    }

    render() {
        if (!JSON.parse(localStorage.getItem('user'))) {
            return <Redirect to='/login'/>
        }
        if (!this._col.isLoaded) {
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
                            if (foundEvent) {
                                return <div className='calendarColumnDay' key={dayIndex}>
                                    <p className="boldText">
                                        {day}
                                    </p>
                                    <p>{foundEvent[0].data.type}</p>
                                </div>
                            }
                            else {
                                return <div className='calendarColumnDay' key={dayIndex}>
                                    <p className="boldText">
                                        {day}
                                    </p>
                                </div>
                            }
                        })}
                    </div>
                    <hr className='calendarLineBreak'/>
                </>
            })}
        </div>
    }
})

class EditCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: this.props.match.match.params,
        };

        this._col = new Collection('calendar', {
            query: (ref) => ref.where('startTime', '>', new Date(this.state.params.year + '-' + this.state.params.month + '-' + 1))
        });
    }


    render() {
        if (!JSON.parse(localStorage.getItem('userDocument')).admin) {
            return <Redirect to='/'/>
        }
    }
}


export {Calendar}
