import React from 'react';
import {observer} from "mobx-react";
import {Button, Pane, Card, majorScale, minorScale} from "evergreen-ui";
import {calendar} from "../sync/models/calendar";

const CalendarEvent = observer(class CalendarEvent extends React.Component {
    render() {
        let event = calendar.events.find(o => {
            return o.id === this.props.match.match.params.id;
        });
        return event ? <>
            <Pane>
                <h5>{event.type} on {new Date(event.startTime.seconds * 1000).getDate()}</h5>
                <Card elevation={1} padding={minorScale(2)} background="#E4E7EB" margin={minorScale(2)}>
                    <p>We are working on a feature to let you see all your club members who have confirmed that they
                        will
                        attend this event.</p>
                    <Button is="a" href="https://github.com/d3bate/d3bate/issues/3" iconAfter="info-sign"
                            appearance="primary">More info</Button>
                </Card>
                <Button height={majorScale(3)} onClick={e => {
                    e.preventDefault();
                    this.props.match.history.push('/register/' + event.id)
                }} iconAfter="arrow-right" intent="success">Take a register</Button>
            </Pane>
        </> : <p>Loading...</p>
    }
});

export {CalendarEvent}