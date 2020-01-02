import React, {useState} from 'react';
import {observer} from "mobx-react";
import {Combobox, Button, TextInput} from "evergreen-ui";
import {clubUsers} from "../sync/models/clubUsers";
import ReactMarkdown from 'react-markdown';
import {debateNotes} from "../sync/models/debateNotes";
import {debatingClub} from "../sync/models/club";

const SpeakerConfig = props => {
    const [edit, setEdit] = useState(false);
    if (edit)
        return <>
            <Combobox items={clubUsers.users} onChange={selected => {
                props.setSpeaker(selected)
            }} placeholder={props.speaker}/>
            <Button iconAfter="tick" onClick={e => {
                setEdit(false)
            }}>Finish editing</Button>
        </>;
    else
        return <>
            <p>Speaker 1: {props.speaker}</p>
            <Button iconAfter="pencil" onClick={e => {
                setEdit(true)
            }}>Edit</Button>
        </>
};

const SpeakerBox = props => {
    const [edit, setEdit] = useState(false);
    if (edit)
        return <>
            <TextInput type="text" onChange={props.updateSpeaker} value={props.speaker}/>
        </>;

    else
        return <>
            <ReactMarkdown source={props.speaker}/>
            <Button onClick={e => setEdit(true)} iconAfter="pencil">Edit</Button>
        </>
};

const Speaker = props => {
    return <>
        <SpeakerConfig setSpeaker={props.setSpeaker} speaker={speaker}/>
        <SpeakerBox updateSpeaker={props.updateSpeaker} speaker={speakerNotes}/>
    </>
};

const Team = props => {
    return <>
        <Speaker setSpeaker={props.setSpeaker1} speaker={props.speaker1} updateSpeaker={props.updateSpeaker1}
                 speakerNotes={props.speaker1Notes}/>
        <Speaker setSpeaker={props.setSpeaker2} speaker={props.speaker2} updateSpeaker={props.updateSpeaker2}
                 speakerNotes={props.speaker2Notes}/>
    </>
};

const DebateJudger = observer(props => {
    let doc = debateNotes.debates.find(o => o.id === props.id);
    let state, setState;
    if (doc) {
        let [state, setState] = useState(doc);
    } else {
        let [state, setState] = {
            clubID: debatingClub.club.id,
            eventID: this.props.eventID,
            og: {
                speaker1: '',
                speaker2: '',
                speaker1text: '',
                speaker2text: ''
            },
            oo: {
                speaker1: '',
                speaker2: '',
                speaker1text: '',
                speaker2text: ''
            },
            cg: {
                speaker1: '',
                speaker2: '',
                speaker1text: '',
                speaker2text: ''
            },
            co: {
                speaker1: '',
                speaker2: '',
                speaker1text: '',
                speaker2text: ''
            }
        }
    }
    return <>
        <h5>Judge a debate</h5>
        <div className="row-wrap">
            <div className="col-50">
                <Team setSpeaker1={e => {
                    setState(state => {
                        return {}
                    })
                }} speaker1={state.og.speaker1} setSpeaker2={e => {
                }} speaker2={state.og.speaker2}/>
                <Team/>
            </div>
            <div className="col-50">
                <Team/>
                <Team/>
            </div>
        </div>
    </>;

});

export {DebateJudger}
