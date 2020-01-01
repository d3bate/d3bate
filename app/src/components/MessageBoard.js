import React from 'react';
import {messages} from "../sync/messages";
import {observer} from "mobx-react";
import {Alert, majorScale} from "evergreen-ui";

const MessageBoard = observer(class MessageBoard extends React.Component {
    render() {
        return <>
            {messages.messages.map(message => {
                return <Alert appearance="card" intent={message.category} marginBottom={majorScale(4)}>
                    <p>{message.title}</p>
                    <p>{message.body}</p>
                    <button onClick={() => {
                        messages.deleteMessage(message.id)
                    }}>Dismiss message
                    </button>
                </Alert>
            })}
        </>
    }
});

export {MessageBoard}