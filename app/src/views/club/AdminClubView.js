import React from 'react';
import {observer} from "mobx-react";
import {debatingClub} from "../../sync/models/club";
import {Pane, Card, Button, minorScale} from "evergreen-ui";
import {appState} from "../../sync/models";
import {Link} from "react-router-dom";


const AdminClubView = observer(class AdminClubView extends React.Component {
    render() {
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
        </>
    }
});

export {AdminClubView};