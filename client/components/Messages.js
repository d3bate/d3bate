import React from "react";
import {Text, View} from "react-native";
import {connect} from "react-redux";
import {colours} from "../styles";

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
                            maxWidth: 300
                        }}
                        key={messageIndex}>
                        <Text>{message.message}</Text>
                        <Text>{message.suggestion}</Text>
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
})(Messages)
