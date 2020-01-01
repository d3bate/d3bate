import React from 'react';
import {Redirect} from "react-router-dom";
import {observer} from "mobx-react";
import * as moment from "moment";
import {DatePicker} from "../components/DatePicker";
import {attendanceEvents} from "../sync/models/attendance";
import {calendar} from "../sync/models/calendar";
import {majorScale} from "evergreen-ui";
import {ViewEvent} from "../components/ViewEvent";

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


const Calendar = observer(class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            redirectLocation: null
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
    }


    render() {
        if (!JSON.parse(localStorage.getItem('user')))
            return <Redirect to='/login'/>;

        return <>
            <h5>{months[this.props.match.match.params.month]} of {this.props.match.match.params.year}</h5>
            <DatePicker year={this.props.match.match.params.year}
                        month={this.props.match.match.params.month}
                        match={this.props.match}/>
            <div style={{marginRight: majorScale(2)}}>
                <div className="row-wrap" style={{justifyContent: 'space-between'}}>
                    {[1, 2, 3, 4, 5, 6, 7].map((day, dayIndex) => {
                        let date = moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + day, 'YYYY-MM-DD').toDate();
                        return <div className="col-1 date" key={dayIndex} style={{textAlign: 'center'}}>
                            <p><b>{days[date.getDay()]}</b></p>
                        </div>
                    })}
                </div>

                {this.state.weeks.map((week, weekIndex) => {
                    return <div className="row-wrap" style={{justifyContent: 'space-between'}} key={weekIndex}>
                        {week.map((day, dayIndex) => {
                            let event = calendar.events.find(o => {
                                let date = new Date(o.startTime.seconds * 1000);
                                return date.getFullYear().toString() === this.props.match.match.params.year
                                    && (date.getMonth() + 1).toString() === this.props.match.match.params.month
                                    && date.getDate() === day
                            });
                            let attendance = event ? attendanceEvents.events.find(o => {
                                return o.eventID === event['id']
                            }) : null;
                            let attending;
                            if (attendance) {
                                attending = attendance.attending;
                            } else {
                                attending = false;
                            }

                            return <div className="col-1 date" key={dayIndex}>
                                <ViewEvent attending={attending} attendance={attendance} event={event}
                                           match={this.props.match} day={day}/>
                            </div>
                        })}
                    </div>
                })}
            </div>
        </>
    }
});


export {Calendar}
