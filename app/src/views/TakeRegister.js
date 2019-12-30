import React from 'react';
import {observer} from "mobx-react";
import {Card, Pane, majorScale, Checkbox, Button} from "evergreen-ui";
import {calendar} from "../sync/models/calendar";
import {clubUsers} from "../sync/models/clubUsers";
import {registerDocuments} from "../sync/models/register";
import {firebase} from '../sync';


const TakeRegister = observer(class TakeRegister extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            attendingUsers: [],
            checkboxes: {},
            loaded: false
        };

        let doc = registerDocuments.docs.find(o => {
            return o.id === this.props.match.match.params.id;
        });

        if (doc) {
            this.state.attendingUsers = doc.attendingUsers;
            let checkboxes = {};
            clubUsers.users.map(user => {
                if (doc.attendingUsers.find(o => {
                    return o === user.id
                })) {
                    this.state.checkboxes[user.id] = true
                }
            });
            this.state.loaded = true;
        }


        this.addAttendingUser = this.addAttendingUser.bind(this);
        this.removeAttendingUser = this.removeAttendingUser.bind(this);
    }

    addAttendingUser(uid) {
        this.setState(state => {
            const attendingUsers = state.attendingUsers.concat(uid);
            return {
                attendingUsers
            }
        })
    }

    removeAttendingUser(uid) {
        this.setState(state => {
            const attendingUsers = state.attendingUsers.filter(o => {
                return o !== uid
            });
            return {
                attendingUsers
            }
        })
    }

    render() {
        if (!this.state.loaded)
            return <p>Loading...</p>;
        let registerEvent = calendar.events.filter(o => {
            return o.id === this.props.match.match.params.id
        });
        if (registerEvent.length > 0) {
            registerEvent = registerEvent[0]
        } else {
            registerEvent = null;
        }
        return registerEvent ? <>
            <Card margin={majorScale(2)} padding={majorScale(2)}>
                <form onSubmit={event => {
                    event.preventDefault();
                    firebase.firestore().collection('register').doc(this.props.match.match.params.id).set({
                        clubID: registerEvent.clubID,
                        eventID: this.props.match.match.params.id,
                        attendingUsers: this.state.attendingUsers
                    })
                }}>
                    <h5>Register for {registerEvent.type}</h5>
                    <p>This event is happening on: {new Date(registerEvent.startTime.seconds * 1000).toDateString()}</p>
                    {clubUsers.users.map((user, userIndex) => {
                        return <Pane key={userIndex}>
                            <p>{user.email}</p>
                            <Checkbox checked={this.state.checkboxes[user.id]} onChange={event => {
                                let checked = event.target.checked;
                                checked ? this.addAttendingUser(user.id) : this.removeAttendingUser(user.id);
                                this.setState(state => {
                                    const attendingUsers = state.attendingUsers;
                                    let checkboxes = state.checkboxes;
                                    checkboxes[user.id] = checked;
                                    return {
                                        attendingUsers,
                                        checkboxes
                                    }
                                })
                            }}/>
                        </Pane>;
                        }
                    )}
                    <Button iconAfter="tick" intent="success">Save register</Button>
                    <Button iconAfter="ban-circle" intent="danger">Discard changes</Button>
                </form>
            </Card>
        </> : <p>Error. This page is either still loading or we could not find that event in your debating club's
            calendar.</p>
    }
});

export {TakeRegister}