import React from 'react';
import {observer} from "mobx-react";
import {debatingClub} from "../../sync/models/club";
import {Pane, Card, Button, minorScale} from "evergreen-ui";
import {appState} from "../../sync/models";


const MemberClubView = observer(class AdminClubView extends React.Component {
    render() {
        console.log(debatingClub);
        if (!debatingClub.club)
            return <p>Loading</p>;
        return <>
            <Pane margin={'10px'} padding={'10px'}>
                <h6>Hi {appState.user.displayName}. You are a member of the {debatingClub.club.clubID} debating
                    club. </h6>
            </Pane>
            <Card elevation={1} padding={'10px'} margin={'10px'}>
                <h6>Quick actions</h6>
                <p>Be warned – none of these work.</p>
                <Button marginRight={minorScale(3)}>View the calendar</Button>
            </Card>
        </>
    }
});

export {MemberClubView};