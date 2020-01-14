import React, {useState} from 'react';
import {observer} from "mobx-react";
import {Combobox, Card, Textarea, minorScale, Button} from "evergreen-ui";
import {clubUsers} from "../sync/models/clubUsers";
import ReactMarkdown from 'react-markdown';
import {debateNotes} from "../sync/models/debateNotes";
import {debatingClub} from "../sync/models/club";
import {firebase} from "../sync";

const PersonSelector = observer((props) => {
    return props.selectedUser === undefined ? <>
        <Combobox items={clubUsers.users.map(user => user.email)}
                  placeholder="Speaker:"
                  onChange={selected => {
                      props.updateUser(clubUsers.users.find(user => user.email === selected))
                  }}/>
    </> : <Combobox items={clubUsers.users.map(user => user.email)}
                    initialSelectedItem={{label: clubUsers.users.find(user => user.id === props.selectedUser)}}
                    onChange={selected => {
                        props.updateUser(clubUsers.users.find(user => user.email === selected))
                    }}/>
});

const DebateTeam = (props) => {
    return <>
        <Card margin={minorScale(5)} padding={minorScale(2)} elevation={1}>
            <p><b>Speaker 1</b></p>
            <PersonSelector user={props.speaker1.uid}
                            updateUser={user => props.handleChange({
                                target: {
                                    name: props.team + '-speaker1-uid',
                                    value: user
                                }
                            })}/>
            <Textarea name={props.team + '-' + 'speaker1-notes'}
                      onChange={props.handleChange} value={props.speaker1.notes}
            />
        </Card>
        <Card margin={minorScale(5)} padding={minorScale(2)} elevation={1}>
            <p><b>Speaker 2</b></p>
            <PersonSelector user={props.speaker2.uid}
                            updateUser={user => props.handleChange({
                                target: {
                                    name: props.team + '-speaker2-uid',
                                    value: user
                                }
                            })}/>
            <Textarea name={props.team + '-' + 'speaker2-notes'}
                      onChange={props.handleChange} value={props.speaker2.notes}
            />
        </Card>
        <hr/>
    </>
};

const DebateJudger = observer(class DebateJudger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            og: {
                speaker1: {
                    uid: '',
                    notes: ''
                },
                speaker2: {
                    uid: '',
                    notes: ''
                }
            },
            oo: {
                speaker1: {
                    uid: '',
                    notes: ''
                },
                speaker2: {
                    uid: '',
                    notes: ''
                }
            },
            cg: {
                speaker1: {
                    uid: '',
                    notes: ''
                },
                speaker2: {
                    uid: '',
                    notes: ''
                }
            },
            co: {
                speaker1: {
                    uid: '',
                    notes: ''
                },
                speaker2: {
                    uid: '',
                    notes: ''
                }
            },
            exists: false,
        };
        this.handleChange = this.handleChange.bind(this);
        let doc = debateNotes.debates.find(o => {
            return o.eventID === this.props.eventID
        });
        if (doc) {
            console.log(doc);
            this.state.exists = true;
            this.state.og = {...doc.og};
            this.state.oo = {...doc.oo};
            this.state.cg = {...doc.cg};
            this.state.co = {...doc.co};
            this.state.eventID = doc.eventID;
            this.state.id = doc.id;
            this.state.judge = doc.judge;
            console.log(this.state);
        }
    }

    handleChange(event) {
        let {name, value} = event.target;
        let nameParts = name.split('-');

        this.setState((prevState) => {
            let newState = {...prevState};
            newState[nameParts[0]][nameParts[1]][nameParts[2]] = value;
            return newState
        })
    }

    render() {

        return <>
            <p><b>NOTE: This does not yet work. You can help by <a href="https://github.com/d3bate/d3bate/issues/7"
                                                                   target="_blank">giving feedback</a> on this. To
                escape from this page, click the escape key ('esc').</b></p>
            <form onSubmit={event => {
                event.preventDefault();
                if (this.state.exists) {
                    firebase.firestore().collection('judge').doc(this.state.id).update({
                        oo: this.state.oo,
                        og: this.state.og,
                        co: this.state.co,
                        cg: this.state.cg
                    })
                } else {
                    firebase.firestore().collection('judge').add({
                        clubID: debatingClub.club.clubID,
                        oo: this.state.oo,
                        og: this.state.og,
                        co: this.state.co,
                        cg: this.state.cg,
                        judge: firebase.auth().currentUser.uid,
                        eventID: this.props.eventID
                    })
                }
            }
            }>
                <div className="row-wrap">
                    <div className="col-50">
                        <DebateTeam team={'og'} speaker1={this.state.og.speaker1} speaker2={this.state.og.speaker2}
                                    handleChange={this.handleChange}/>
                        <DebateTeam team={'cg'} speaker1={this.state.cg.speaker1} speaker2={this.state.cg.speaker2}
                                    handleChange={this.handleChange}/>
                    </div>
                    <div className="col-50">
                        <DebateTeam team={'oo'} speaker1={this.state.oo.speaker1} speaker2={this.state.oo.speaker2}
                                    handleChange={this.handleChange}/>
                        <DebateTeam team={'co'} speaker1={this.state.co.speaker1} speaker2={this.state.co.speaker2}
                                    handleChange={this.handleChange}/>
                    </div>
                </div>
                <Button>Save.</Button>
            </form>
        </>
    }
});


export {DebateJudger}
