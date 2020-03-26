import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {Provider} from "react-redux";
import {Route, Router, Switch} from "./routing/routing";
import {configStore} from "./state";
import Login from "./views/Login";
import Register from "./views/Register";
import Navbar from "./components/Navbar";
import Messages from "./components/Messages";

let store = configStore();

export default function App() {
    return (
        <SafeAreaView>
            <Provider store={store}>
                <View>
                    <Navbar/>
                    <View style={{margin: 10}}>
                        <Messages/>
                        <Router>
                            <Switch>
                                <Route exact path="/">
                                </Route>
                                <Route exact path="/login">
                                    <Login/>
                                </Route>
                                <Route exact path="/register">
                                    <Register/>
                                </Route>
                                <Route exact path="/club">
                                </Route>
                                <Route exact path="/club/training-sessions">
                                </Route>
                                <Route exact path="/club/training-sessions/edit">
                                </Route>
                                <Route exact path="/club/training-sessions/livestream">
                                </Route>
                            </Switch>
                        </Router>
                    </View>
                </View>
            </Provider>
        </SafeAreaView>
    );
}
