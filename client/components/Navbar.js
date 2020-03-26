import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colours} from "../styles";
import {connect} from "react-redux";

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {
        if (this.state.open)
            return <>
                <View
                    style={{backgroundColor: colours.primary, display: "flex", flexDirection: "row", padding: 10}}>
                    <TouchableOpacity style={{display: "flex", flexDirection: "row"}} onPress={press => {
                        this.setState({open: false})
                    }}>
                        <Ionicons name="md-close" size={32} color="white"/>
                        <Text style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>close</Text>
                    </TouchableOpacity>

                </View>
                <View style={{backgroundColor: colours.primary, display: "flex", flexDirection: "column", padding: 10}}>
                    <Text style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>Home</Text>
                    {this.props.auth.jwt ? <>
                            <Text style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>Club</Text>
                            <Text style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>Calendar</Text>
                            <Text style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>Join debate</Text>
                        </> :
                        <>
                            <Text
                                style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>Login</Text>
                            <Text
                                style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>Register</Text>
                        </>}
                </View>
            </>;
        else
            return (
                <View style={{backgroundColor: colours.primary, display: "flex", flexDirection: "row", padding: 10}}>
                    <TouchableOpacity onPress={press => {
                        this.setState({open: true})
                    }}>
                        <Ionicons name="md-menu" size={32} color="white"/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 24, color: "white", paddingLeft: 10, paddingTop: 2}}>d3bate</Text>
                </View>
            );
    }
}

export default connect((state, ownProps) => {
    return {
        auth: state.auth,
        ...ownProps
    }
})(Navbar);
