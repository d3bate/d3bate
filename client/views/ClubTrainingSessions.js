import React from "react";
import {View} from "react-native";
import {connect} from "react-redux";

class ClubTrainingSessions extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>

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
