import React from 'react';
import {observer} from "mobx-react";
import {appState} from "../sync/models";
import {Card} from "evergreen-ui";
import {Identicon} from "react-identicons";

export const Profile = observer(class Profile extends React.Component {
    render() {
        if (!appState.user)
            return <p>Loading</p>;
        return <>
            <Card elevation={1} width={'75%'} padding={'20px'} marginTop={'10px'}>
                <div style={{float: 'left', paddingRight: '5px'}}>
                </div>
                <div>
                    <h6>Name: {appState.user.displayName}</h6>
                    <p>Email: {appState.user.email}</p>
                </div>
            </Card>
        </>
    }
});

