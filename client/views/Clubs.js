import React from "react";
import {Text, View} from "react-native";
import {connect} from "react-redux";
import {Redirect} from "../routing/routing";

class Clubs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.auth.jwt)
            return <Redirect to="/login"/>;
        return (
            <View>
                {this.props.clubs.clubs.length > 0 ? null : <View>
                    <Text style={{fontSize: 24}}>You are not a member of any clubs</Text>
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
})(Clubs);
