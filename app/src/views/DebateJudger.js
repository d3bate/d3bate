import React, {useState} from 'react';
import {observer} from "mobx-react";
import {Combobox, Card, Textarea, minorScale} from "evergreen-ui";
import {clubUsers} from "../sync/models/clubUsers";
import ReactMarkdown from 'react-markdown';
import {debateNotes} from "../sync/models/debateNotes";
import {debatingClub} from "../sync/models/club";

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
        <form onSubmit={event => event.preventDefault()}>
            <Card margin={minorScale(5)} padding={minorScale(2)} elevation={1}>
                <p><b>Speaker 1</b></p>
                <PersonSelector user={props.speaker1}
                                updateUser={user => props.handleChange({
                                    target: {
                                        name: props.team + '-speaker1-uid',
                                        value: user
                                    }
                                })}/>
                <Textarea name={props.team + '-' + 'speaker1-notes'}
                          onChange={props.handleChange}
                />
            </Card>
            <Card margin={minorScale(5)} padding={minorScale(2)} elevation={1}>
                <p><b>Speaker 2</b></p>
                <PersonSelector user={props.speaker2}
                                updateUser={user => props.handleChange({
                                    target: {
                                        name: props.team + '-speaker2-uid',
                                        value: user
                                    }
                                })}/>
                <Textarea name={props.team + '-' + 'speaker2-notes'}
                          onChange={props.handleChange}
                />
            </Card>
            <hr/>
        </form>
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
            }
        };
        this.handleChange = this.handleChange.bind(this);
        if (debateNotes.notes) {
            let notes = debateNotes.notes.find(o => o.id === this.props.id);
            if (notes) {
                this.state = notes
            }
        }
    }

    handleChange(event) {
        let {name, value} = event.target;
        let nameParts = name.split('-');

        this.setState(() => ({
            [nameParts[0]]: {
                [nameParts[1]]: {
                    [nameParts[2]]: value
                }
            }
        }))
    }

    render() {

        return <>
            <p><b>NOTE: This does not yet work. You can help by <a href="https://github.com/d3bate/d3bate/issues/7"
                                                                   target="_blank">giving feedback</a> on this.</b></p>
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
        </>
    }
});


export {DebateJudger}
