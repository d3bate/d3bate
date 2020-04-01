import React from "react";
import {connect} from "react-redux";
import {fetchClubSessions, selectClub, selectClubTrainingSessions} from "../state";
import {Redirect} from "../routing/routing"
import {Text, View} from "react-native";
import AddTrainingSession from "../components/Club/AddTrainingSession";

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
        let trainingSessions = this.props.trainingSessions.trainingSessions.filter(o => o.id === parseInt(this.props.match.match.params.clubID));
        if (!this.props.auth.jwt)
            return <Redirect to="/login"/>;
        return this.props.clubs.selectedClub ? <View>
            <Text style={{fontSize: 24}}>{this.props.clubs.selectedClub.name}</Text>
            <Text
                style={{fontSize: 18}}>{this.props.clubs.selectedClub.role === "owner" ? "You own this club" : this.props.clubs.selectedClub.role === "admin" ? "You are an administrator for this club" : "You are a member of this club"}</Text>
            <View>
                {trainingSessions.length > 0 ? <View>
                    {trainingSessions.map((session, sessionIndex) => {
                        return <View key={sessionIndex}>
                            <Text>{new Date(session.start_time).toString()}</Text>
                            <Text>{new Date(session.end_time).toString()}</Text>
                        </View>
                    })}
                    {this.props.clubs.selectedClub.role === "owner" || this.props.clubs.selectedClub.role === "admin" ?
                        <AddTrainingSession clubID={this.props.clubs.selectedClub.id}/> :
                        null}
                </View> : <View>
                    <Text>THERE ARE NO CLUB SESSIONS YET.</Text>
                    {this.props.clubs.selectedClub.role === "owner" || this.props.clubs.selectedClub.role === "admin" ?
                        <AddTrainingSession clubID={this.props.clubs.selectedClub.id}/> :
                        <Text>Watch this space for updates.</Text>}
                </View>}

            </View>
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
}, {fetchClubSessions, selectClubTrainingSessions, selectClub})(Club);
