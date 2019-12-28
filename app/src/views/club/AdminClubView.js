import React from 'react';
import {debatingClub} from "../../sync/models/club";


class AdminClubView extends React.Component {
    render() {
        console.log(debatingClub);
        if (!debatingClub.club)
            return <p>Loading</p>;
        return <>
            <h6>Club ID: {debatingClub.club.id}</h6>
        </>
    }
}

export {AdminClubView};