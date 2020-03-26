import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {colours} from "../styles";
import {deleteMessage} from "../state";
import {Ionicons} from "@expo/vector-icons";

class Messages extends React.Component {
    render() {
        return (
            this.props.messages.length > 0 ? <View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}
                />
                <Text style={{fontSize: 24, paddingBottom: 10}}>Messages</Text>
                {this.props.messages.map((message, messageIndex) => {
                    return <View
                        style={{
                            backgroundColor: message.type === "success" ? colours.tertiary : colours.danger,
                            padding: 10,
                            borderRadius: 3,
                            maxWidth: 300,
                            display: "flex",
                            flexDirection: "row"
                        }}
                        key={messageIndex}>
                        <TouchableOpacity onPress={() => {
                            this.props.deleteMessage(message.id)
                        }} style={{marginRight: 5, paddingTop: 1}}>
                            <Ionicons name="md-remove-circle" size={20} color="white"/>
                        </TouchableOpacity>
                        <Text style={{color: "white", paddingTop: 3}}>{message.message}</Text>
                        <Text style={{color: "white", paddingTop: 3}}>{message.suggestion}</Text>
                    </View>
                })}
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        marginTop: 5
                    }}
                />
            </View> : null
        );
    }
}

export default connect((state, ownProps) => {
    return {
        messages: state.messages.messages,
        ...ownProps
    }
}, {deleteMessage})(Messages)
