import React from 'react';
import {observer} from "mobx-react";
import {Button, Card, Combobox, minorScale, Textarea} from "evergreen-ui";
import {clubUsers} from "../sync/models/clubUsers";
import {debateNotes} from "../sync/models/debateNotes";
import {debatingClub} from "../sync/models/club";
import {firebase} from "../sync";

const PersonSelector = observer((props) => {
    return props.selectedUser === "" ? <>
        <Combobox items={clubUsers.users.map(user => user.email)}
                  placeholder="Speaker:"
                  onChange={selected => {
                      props.updateUser(clubUsers.users.find(user => user.email === selected).uid)
                  }}/>
    </> : <Combobox items={clubUsers.users.map(user => user.email)}
                    initialSelectedItem={clubUsers.users.find(user => user.id === props.selectedUser).email}
                    onChange={selected => {
                        props.updateUser(clubUsers.users.find(user => user.email === selected).uid)
                    }}/>
});

const DebateTeam = (props) => {
    return <>
        <Card margin={minorScale(5)} padding={minorScale(2)} elevation={1}>
            <p><b>Speaker 1</b></p>
            <PersonSelector selectedUser={props.speaker1.uid}
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
            <PersonSelector selectedUser={props.speaker2.uid}
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
            return o.eventID === this.props.eventID && o.debateNumber === this.props.debateNumber;
        });
        if (doc) {
            this.state.exists = true;
            this.state.og = {...doc.og};
            this.state.oo = {...doc.oo};
            this.state.cg = {...doc.cg};
            this.state.co = {...doc.co};
            this.state.eventID = doc.eventID;
            this.state.id = doc.id;
            this.state.judge = doc.judge;
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
                    }).then(result => {
                    })
                } else {
                    firebase.firestore().collection('judge').add({
                        clubID: debatingClub.club.clubID,
                        oo: this.state.oo,
                        og: this.state.og,
                        co: this.state.co,
                        cg: this.state.cg,
                        judge: firebase.auth().currentUser.uid,
                        eventID: this.props.eventID,
                        debateNumber: this.props.debateNumber
                    }).then(result => {
                        this.setState({id: result.id, exists: true})
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


const SelectDebate = observer(class SelectDebate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableDebates: debateNotes.debates.filter(o => {
                return o.eventID === this.props.eventID
            }),
            showAvailable: true,
            selectedDebate: 0,
            showDebate: false
        };
    }

    render() {
        return <>
            {this.state.showAvailable ?
                this.state.availableDebates.map((debate, debateIndex) => {
                    return <Card key={debateIndex}>
                        <p>Debate {debateIndex}</p>
                        <Button appearance="primary"
                                onClick={() => this.setState({
                                    selectedDebate: debateIndex,
                                    showDebate: true
                                })}>View</Button>
                    </Card>
                })
                : null}
            <Card><Button intent="success" onClick={() => this.setState({
                selectedDebate: this.state.availableDebates.length,
                showDebate: true
            })}>Add a
                debate</Button></Card>
            {this.state.showDebate ?
                <DebateJudger debateNumber={this.state.selectedDebate} eventID={this.props.eventID}/> : null}

        </>
    }
});

export {DebateJudger, SelectDebate}
