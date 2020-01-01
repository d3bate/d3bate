import React, {useState} from 'react';
import {observer} from "mobx-react";
import {Combobox, Button, TextInput} from "evergreen-ui";
import {clubUsers} from "../sync/models/clubUsers";
import ReactMarkdown from 'react-markdown';

const SpeakerConfig = observer((props) => {
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
});

const SpeakerBox = observer(props => {
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
});

const Speaker = observer(props => {
    return <>
        <SpeakerConfig setSpeaker={props.setSpeaker} speaker={speaker}/>
        <SpeakerBox updateSpeaker={props.updateSpeaker} speaker={speakerNotes}/>
    </>
});

const DebateJudger = observer(props =>
    <>
        <h5>Judge a debate</h5>

    </>
);

export {DebateJudger}
