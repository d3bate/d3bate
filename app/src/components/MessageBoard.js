import React from 'react';
import {messages} from "../sync/messages";
import {observer} from "mobx-react";
import {Card} from "evergreen-ui";

const MessageBoard = observer(class MessageBoard extends React.Component {
    render() {
        return <>
            {messages.messages.map(message => {
                return <Card>
                    <p>{message.title}</p>
                    <p>{message.body}</p>
                    <button onClick={() => {
                        messages.deleteMessage(message.id)
                    }}>Dismiss message
                    </button>
                </Card>
            })}
        </>
    }
});

export {MessageBoard}