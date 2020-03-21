import React from "react";
import {View} from "react-native";
import {connect} from "react-redux";
import {SelectClub} from "../components/ClubTrainingSessions/SelectClub";
import ViewTrainingSessions from "../components/ClubTrainingSessions/ViewTrainingSessions";


class ClubTrainingSessions extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>
                {this.props.trainingSessions.selectedClub ?
                    <ViewTrainingSessions selectedClub={this.props.trainingSessions.selectedClub}/>
                    : <SelectClub/>}
            </View>
        );
    }

}

export default connect((state, ownProps) => {
    return {
        trainingSessions: state.trainingSessions,
        ...ownProps
    }
})(ClubTrainingSessions)
