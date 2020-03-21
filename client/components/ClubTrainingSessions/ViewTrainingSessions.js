import React from "react";
import {Button, Text, View} from "react-native";
import * as moment from "moment";

export default class ViewTrainingSessions extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>
                <Text>Training sessions</Text>
                {this.props.selectedClub.map((session, sessionIndex) => {
                    return <View key={sessionIndex}>
                        <Text>Start time: {moment.utc(session["start_time"]).toDate().toString()}</Text>
                        <Text>End time: {moment.utc(session["end_time"]).toDate().toString()}</Text>
                        {session["livestream"] ? <Button title="Join livestream" onPress={() => {
                        }
                        }/> : null}
                    </View>
                })}
            </View>
        );
    }

}
