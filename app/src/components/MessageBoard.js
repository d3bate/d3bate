import React from 'react';
import {messages} from "../sync/models";

class MessageBoard extends React.Component {
    render() {
        return <>
            {messages.messages.map(message => {
                return <div className="card">
                    <p>{message.title}</p>
                    <p>{message.body}</p>
                    <button onClick={() => {
                        messages.deleteMessage(id)
                    }}>Dismiss message
                    </button>
                </div>
            })}
        </>
    }
}
