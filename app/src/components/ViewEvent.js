import React from 'react';
import {Button, Card, SideSheet, majorScale, minorScale, Pane} from "evergreen-ui";
import {Checkbox} from "./Checkbox";
import {firebase} from "../sync";
import {debatingClub} from "../sync/models/club";
import {observer} from "mobx-react";
import {CalendarEvent} from "./CalendarEvent";
import {TakeRegister} from "./TakeRegister";

const ViewEvent = observer(class ViewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailView: false,
            register: false
        }
    }

    render() {
        return <Card background="blueTint" margin={4} padding={minorScale(2)} elevation={1}
                     height={'170px'} width={'100px'}>
            <p>{this.props.day} {this.props.event ?
                <Button onClick={() => this.setState({detailView: true})}
                        height={majorScale(3)}>view</Button> : null}</p>
            <p>{this.props.event ? this.props.event['type'] : null}</p>
            {this.props.event ? <>
                <SideSheet position="top" isShown={this.state.detailView} onCloseComplete={() => {
                    this.setState({detailView: false})
                }}>
                    <Pane padding={majorScale(3)}>
                        <CalendarEvent id={this.props.event.id} match={this.props.match}/>
                    </Pane>
                </SideSheet>

                <SideSheet position="top" isShown={this.state.register} onCloseComplete={() => {
                    this.setState({register: false})
                }}>
                    <Pane padding={majorScale(3)}>
                        <TakeRegister id={this.props.event.id}/>
                    </Pane>
                </SideSheet>

                <div><span style={{fontSize: '10px', float: 'left'}}>Attending: </span><Checkbox
                    checked={this.props.attending}
                    // Add attendance documents to the Firestore
                    updateHandler={(e) => {
                        if (this.props.attendance) {
                            firebase.firestore().collection('attendance').doc(this.props.attendance.id).update({
                                attending: e.target.checked
                            })
                        } else {
                            firebase.firestore().collection('attendance').add({
                                eventID: this.props.event.id,
                                attending: e.target.checked,
                                userID: firebase.auth().currentUser.uid,
                                clubID: debatingClub.club.clubID
                            })
                        }
                    }
                    }/></div>
                {debatingClub.club ? debatingClub.club.role === 'admin' ?
                    <Button height={majorScale(3)} onClick={() => {
                        this.setState({register: true})
                    }}>Register</Button> : null : null}</> : null}
        </Card>
    }
});

export {ViewEvent}