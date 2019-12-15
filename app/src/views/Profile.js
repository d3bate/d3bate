import React from 'react';
import {observer} from "mobx-react";
import {appState} from "../sync/models";

export const Profile = observer(class Profile extends React.Component {
    render() {
        if (!appState.user)
            return <p>Loading</p>;
        return <>
            <h1>Name: {appState.user.displayName}</h1>
            <h2>Email: {appState.user.email}</h2>
        </>
    }
});

