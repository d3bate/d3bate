import React from 'react';
import {observer} from "mobx-react";
import {debatingClub} from "../../sync/models/club";
import {Pane, Card, Button, minorScale, Pill} from "evergreen-ui";
import {appState} from "../../sync/models";
import {Link} from "react-router-dom";
import {clubUsers} from "../../sync/models/clubUsers";


const AdminClubView = observer(class AdminClubView extends React.Component {
    render() {
        console.log(clubUsers);
        let currentDate = new Date();
        if (!debatingClub.club)
            return <p>Loading</p>;
        return <>
            <Pane margin={'10px'} padding={'10px'}>
                <h6>Hi {appState.user.displayName}. You are an administrator of the {debatingClub.club.clubID} debating
                    club. </h6>
            </Pane>
            <Card elevation={2} padding={'10px'} margin={'10px'} background="#E4E7EB">
                <h6>Quick actions</h6>
                <p>Be warned – you cannot yet take a register.</p>
                <Button marginRight={minorScale(3)}><Link style={{textDecoration: 'none'}}
                                                          to={'/edit/calendar/' + currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1)}>Edit
                    the
                    calendar</Link></Button>
                <Button marginRight={minorScale(3)}>
                    <Link style={{textDecoration: 'none'}}
                          to={'/calendar/' + currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1)}>View
                        the
                        calendar</Link>
                </Button>
                <Button marginRight={minorScale(3)}>Take a register</Button>
            </Card>
            <Card elevation={2} padding={'10px'} margin={'10px'} background="#D9822B">
                <h6>Club users</h6>
                {clubUsers.users && clubUsers.users.length ? clubUsers.users.map((user, userIndex) => {
                    return <Pill key={userIndex}>{user.email} X</Pill>
                }) : <p>Could not load the users for this club.</p>}
            </Card>
        </>
    }
});

export {AdminClubView};