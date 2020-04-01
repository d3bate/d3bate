import React from "react";
import {Text, View} from "react-native";
import {colours} from "../../styles";
import {Link} from "../../routing/routing";

class ClubList extends React.Component {
    render() {
        return (
            <View>
                <Text style={{fontSize: 24}}>Clubs you belong to</Text>
                {this.props.clubs.map((club, clubIndex) => {
                    return <View style={{margin: 5, backgroundColor: colours.secondary, borderRadius: 3, padding: 5}}
                                 key={clubIndex}>
                        <Text>
                            {club.name}
                        </Text>
                        <Text>
                            Your role: {club.role}
                        </Text>
                        <Link to={`/club/${club.id}`}><Text>View club</Text></Link>
                    </View>
                })}
            </View>
        );
    }
}

export default ClubList;
