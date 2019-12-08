import React from 'react';
import {Redirect} from "react-router-dom";
import {Collection} from "../sync";
import {observer} from "mobx-react";
import * as moment from "moment";
import {appState} from "../sync/models";


const months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
};

const days = {
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THUR',
    5: 'FRI',
    6: 'SAT',
    7: 'SUN'
};


const calendar = new Collection('calendar', {
    query: (ref) => ref
        .where('clubID', '==', appState.debatingClubs ? appState.debatingClubs.docs[0] : null),
});

const filterCalendarDates = (start, stop) => {
    return calendar.docs.filter(doc => {
        return doc.data.startTime > start && doc.data.startTime < stop;
    })
};

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: this.props.initialYear,
            month: this.props.initialMonth,
            redirectUrl: null,
            redirect: false
        }
    }

    render() {

        return <div className="DatePicker">
            <form className="DatePickerForm" onSubmit={(event) => {
                event.preventDefault();
                this.setState({
                    redirect: true,
                    redirectUrl: '/calendar/' + this.state.year + '/' + this.state.month
                });
                this.props.setRedirectUrl('/calendar/' + this.state.year + '/' + this.state.month);
            }}>
                YEAR: <input type="" className="DatePickerInput" value={this.state.year} onChange={(event) => {
                this.setState({
                    year: event.target.value
                })
            }
            }/>
                &nbsp; MONTH: <input type="" className="DatePickerInput" value={this.state.month} onChange={(event) => {
                this.setState({month: event.target.value})
            }
            }/>
                <input type="submit" value="GO => " className="DatePickerSubmit"/>
            </form>
        </div>
    }
}


const AttendanceCheckbox = observer(class AttendanceCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doc: this.props.doc[0],
            attending: this.props.doc[0] ? this.props.doc[0].data.attending : false,
        };
        this.updateStatus = this.updateStatus.bind(this);
    }

    updateStatus(event) {
        const target = event.target;
        const isAttending = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            attending: isAttending
        });
        if (this.state.doc) {
            this.state.doc.update({
                attending: isAttending
            })
        }
        else {
            this.props.events.add({
                attending: isAttending,
                userID: JSON.parse(localStorage.getItem('user')).uid,
                eventID: this.props.eventID
            })
                .then(doc => {
                    this.setState({
                        doc: doc
                    })
                })

        }
    }

    render() {
        return <>
            <input type="checkbox" checked={this.state.attending} onChange={this.updateStatus}/>
        </>
    }
});


const Calendar = observer(class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: this.props.match.match.params,
            redirectUrl: null
        };


        // Thanks to https://stackoverflow.com/questions/563406/add-days-to-javascript-date#answer-19691491
        this.incrementDate = date => {
            let result = new Date(date);
            return new Date(result.setDate(result.getDate() + 28));
        };

        this._col = new Collection('calendar', {
            query: (ref) => ref
                .where('startTime', '>', moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + 1, 'YYYY-MM-DD').toDate())
                .where('startTime', '<',
                    this.incrementDate(moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + 1, 'YYYY-MM-DD').toDate()))
        });

        console.log(appState.user);
        this._events = new Collection('attendance', {
            query: (ref) => ref.where('userID', '==', appState.user ? appState.user.uid : null)
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
        this.setRedirectUrl = this.setRedirectUrl.bind(this)
    }

    findEvent(day) {
        //let filteredDocs = this._col.docs.filter(doc => {
        //    return new Date(doc.data.startTime.seconds * 1000).getDate() === day;
        //});

        let filteredDocs = filterCalendarDates(
            moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + 1, 'YYYY-MM-DD')
                .toDate(),
            this.incrementDate(
                moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + 1, 'YYYY-MM-DD')
                    .toDate())
        );

        if (!filteredDocs.length > 0) {
            filteredDocs = false;
        }
        return filteredDocs;
    }

    findAttendance(eventID) {
        return this._events.docs.filter(doc => {
            return doc.data.eventID === eventID
        })
    }


    setRedirectUrl(url) {
        this.props.match.history.push(url);
    }

    render() {
        if (!JSON.parse(localStorage.getItem('user')))
            return <Redirect to='/login'/>;
        if (this.state.redirectUrl)
            return <Redirect to={this.state.redirectUrl}/>;
        if (!this._col.isLoaded || !this._events.isLoaded)
            return <h1>Loading data</h1>;

        return <div className='container'>
            <h1>The calendar</h1>

            <DatePicker initialYear={this.state.params.year} initialMonth={this.state.params.month}
                        setRedirectUrl={this.setRedirectUrl}/>

            <h3>{months[this.props.match.match.params.month]} of {this.props.match.match.params.year}</h3>

            <div className="calendarRowWeekTop" style={{marginBottom: 50}}>
                {[1, 2, 3, 4, 5, 6, 7].map((day, dayIndex) => {
                    let date = moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + day).toDate();
                    return <div className="calendarColumnDay" key={dayIndex}>
                        <p>{days[date.getDay()]}</p>

                    </div>
                })}
            </div>

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
                                    <AttendanceCheckbox doc={this.findAttendance(foundEvent[0].id)}
                                                        events={this._events} eventID={foundEvent[0].id}/>

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
});


export {Calendar}
