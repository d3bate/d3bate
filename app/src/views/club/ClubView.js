import React from 'react';
import {observer} from "mobx-react";
import {debatingClub} from "../../sync/models/club";
import {Pane, Card, Button, minorScale} from "evergreen-ui";
import {appState} from "../../sync/models";
import {AdminClubView} from "./AdminClubView";
import {MemberClubView} from "./MemberClubView";

const ClubView = observer(class ClubView extends React.Component {
    render() {
        if (debatingClub.club) {
            if (debatingClub.club.role === 'admin')
                return <AdminClubView/>;
            if (debatingClub.club.role === 'user')
                return <MemberClubView/>;
        } else
            return <p>Loading</p>
    }
});


export {ClubView};