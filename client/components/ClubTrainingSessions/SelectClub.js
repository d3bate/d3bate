import React from "react";
import {Button, Text, View} from "react-native";

export default class ClubSelector extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View>
                <Text>Select a club</Text>
                {this.props.clubs.map((club, clubIndex) => {
                    return <Button key={clubIndex} title={club["name"]} onPress={() => {
                        this.props.selectClub(club["id"])
                    }}/>
                })}
            </View>
        );
    }
}
