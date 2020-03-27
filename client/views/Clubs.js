import React from "react";
import {Text, View} from "react-native";
import {connect} from "react-redux";
import {Redirect} from "../routing/routing";
import CreateClub from "../components/Clubs/CreateClub";
import {fetchClubData} from "../state";

class Clubs extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchClubData();
    }

    render() {
        if (!this.props.auth.jwt)
            return <Redirect to="/login"/>;
        return (
            <View>
                {this.props.clubs.clubs.length > 0 ? null : <View>
                    <Text style={{fontSize: 24}}>You are not a member of any clubs</Text>
                    <View style={{
                        marginTop: 5,
                        borderColor: "grey",
                        borderRadius: 3,
                        borderWidth: 1,
                        maxWidth: 300,
                        padding: 10
                    }}>
                        <CreateClub/>
                    </View>
                </View>}
            </View>
        );
    }

}

export default connect((state, ownProps) => {
    return {
        clubs: state.clubs,
        auth: state.auth,
        ...ownProps
    }
}, {fetchClubData})(Clubs);
