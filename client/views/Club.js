import React from "react";
import { connect } from "react-redux";
import { fetchClubSessions, selectClub, selectClubTrainingSessions } from "../state";
import { Redirect } from "../routing/routing"
import { Text, View } from "react-native";
import AddTrainingSession from "../components/Club/AddTrainingSession";
import { colours } from "../styles";
import { authRedirect } from "../utils";

const clubRoleOf = (selectedClub) => {
    return selectedClub.role === "owner" ? "You own this club" : selectedClub.role === "admin" ? "You are an administrator for this club" : "You are a member of this club"
}

const findTrainingSessions = (trainingSessions, clubID) => trainingSessions.trainingSessions.filter(o => o.id === parseInt(clubID));

/**
 * The `Club` component shows a list of training sessions associated with a club.
 * Planned: The component will also show a list of members belonging to the club.
 * Planned: The component will also offer chat functionality for clubs.
 */
class Club extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.auth.jwt) {
            this.props.fetchClubSessions(this.props.match.match.params.clubID);
            this.props.selectClub(this.props.match.match.params.clubID);
        }
    }

    render() {
        let trainingSessions = findTrainingSessions(this.props.trainingSessions, parseInt(this.props.match.match.params.clubID));
        if (!this.props.auth) {
            return authRedirect(this.props.auth)
        }
        return this.props.clubs.selectedClub ? <View>
            <Text style={{ fontSize: 24 }}>{this.props.clubs.selectedClub.name}</Text>
            <Text
                style={{ fontSize: 18 }}>{clubRoleOf(this.props.clubs.selectedClub)}</Text>
            <View style={{ backgroundColor: colours.primary, padding: 5, borderRadius: 3, marginBottom: 5 }}>
                <Text style={{ fontSize: 18 }}>Training sessions</Text>
                {trainingSessions.length > 0 ? <View>
                    {trainingSessions.map((session, sessionIndex) => {
                        return <View key={sessionIndex} style={{
                            backgroundColor: "white",
                            borderRadius: 3,
                            marginTop: 5,
                            marginBottom: 5,
                            padding: 5
                        }}>
                            <Text>Start time: {new Date(session.start_time).toString()}</Text>
                            <Text>End time: {new Date(session.end_time).toString()}</Text>
                        </View>
                    })}
                </View> : <View>
                        <Text>THERE ARE NO CLUB SESSIONS YET.</Text>
                        {this.props.clubs.selectedClub.role === "owner" || this.props.clubs.selectedClub.role === "admin" ?
                            <AddTrainingSession clubID={this.props.clubs.selectedClub.id} /> :
                            <Text>Watch this space for updates.</Text>}
                    </View>}
            </View>
            <AddTrainingSession clubID={this.props.clubs.selectedClub.id} />
        </View> : <Text>Loading...</Text>
    }
}

export default connect((state, ownProps) => {
    return {
        auth: state.auth,
        clubs: state.clubs,
        trainingSessions: state.trainingSessions,
        ...ownProps
    }
}, { fetchClubSessions, selectClubTrainingSessions, selectClub })(Club);
