import React from 'react';
import {Redirect} from "react-router-dom";
import {Collection} from "../sync";
import {observer} from "mobx-react";

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
        console.log(this.state.redirectUrl)
        if (this.redirect)
            return <Redirect to={this.state.redirectUrl}/>;

        return <div className="DatePicker">
            <form className="DatePickerForm" onSubmit={(event) => {
                event.preventDefault();
                this.setState({
                    redirect: true,
                    redirectUrl: '/calendar/' + this.state.year + '/' + this.state.month
                })
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
            <DatePicker initialYear={this.state.params.year} initialMonth={this.state.params.month}/>
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
});

class ViewEvent extends React.Component {
    render() {
        return <div className="ViewEvent">
            <h3 className="ViewEventTitle">{this.props.doc.data.type}</h3>
            <p>{new Date(this.props.doc.data.startTime.seconds).toString()}</p>
        </div>
    }
}

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
        console.log(JSON.parse(localStorage.getItem('userDocument')));
        if (!JSON.parse(localStorage.getItem('userDocument')).admin === true)
            return <Redirect to='/'/>;

        if (!this._col.isLoaded)
            return <h3>Loading data</h3>;
        return <>
            <div className="ViewCalendar">
                {this._col.docs.map(doc => {
                    return <ViewEvent doc={doc}/>
                })}
            </div>
        </>

    }
}


export {Calendar, EditCalendar}
