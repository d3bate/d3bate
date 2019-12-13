import React from 'react';
import {Redirect} from "react-router-dom";
import {calendar} from "../sync/models";
import {observer} from "mobx-react";
import * as moment from "moment";

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


let filterCalendarEvents = (start, stop, year, month) => {
    return calendar.events.filter(o => {
        return start > moment(
            year + '-' + month, 'YYYY-MM') && stop < moment(
            year + '-' + (month + 1), 'YYYY-MM')
    })
};


class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: this.props.year,
            month: this.props.month,
        }
    }

    render() {

        return <div className="DatePicker">
            <form className="DatePickerForm" onSubmit={(event) => {
                event.preventDefault();
                window.location.href = '/calendar/' + this.state.year + '/' + this.state.month
            }}>
                YEAR: <input type="" className="DatePickerInput" value={this.state.year} onChange={(event) => {
                this.setState({
                    year: event.target.value
                })
            }
            }/>
                &nbsp; MONTH: <input type="" className="DatePickerInput" value={this.state.month}
                                     onChange={(event) => {
                                         this.setState({month: event.target.value})
                                     }
                                     }/>
                <input type="submit" value="GO => " className="DatePickerSubmit"/>
            </form>
        </div>
    }
}

const Calendar = observer(class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectUrl: this.props.match.path
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
        return <>
            <h1>{months[this.props.match.match.params.month]} of {this.props.match.match.params.year}</h1>
            <DatePicker year={this.props.match.match.params.year}
                        month={this.props.match.match.params.month}/>
            <div>
                <div className="row">
                    {[1, 2, 3, 4, 5, 6, 7].map((day, dayIndex) => {
                        let date = moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + day).toDate();
                        return <div className="col-1 date" key={dayIndex}>
                            <p>{days[date.getDay()]}</p>
                        </div>
                    })}
                </div>

                {this.state.weeks.map((week, weekIndex) => {
                    return <div className="row" key={weekIndex}>
                        {week.map((day, dayIndex) => {
                            let event = calendar.events.find(o => {
                                let startDate = new Date(o.startTime.seconds * 1000);
                                let eventDate = moment(this.props.match.match.params.year + '-' + this.props.match.match.params.month + '-' + day);
                                return startDate.getDate() === day
                                    && (startDate) >= eventDate.toDate()
                                //&& (startDate) <= eventDate.clone().add(1, 'month')
                            });
                            return <div className="col-1 date" key={dayIndex}>
                                <p>{day}</p>
                                <p>{event ? event['type'] : null}</p>
                            </div>
                        })}
                    </div>
                })}
            </div>
        </>
    }
});


export {Calendar}
