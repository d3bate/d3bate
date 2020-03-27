import React from "react";
import {Text, View} from "react-native";
import {colours} from "../../styles";

class ClubList extends React.Component {
    render() {
        return (
            <View>
                <Text style={{fontSize: 24}}>Clubs you belong to</Text>
                {this.props.clubs.map((club, clubIndex) => {
                    return <View style={{margin: 5, backgroundColor: colours.secondary, borderRadius: 3, padding: 5}}>
                        <Text>
                            {club.name}
                        </Text>
                        <Text>
                            Your role: {club.role}
                        </Text>
                    </View>
                })}
            </View>
        );
    }
}

export default ClubList;
