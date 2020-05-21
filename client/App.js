import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Provider } from "react-redux";
import { Route, Router, Switch } from "./routing/routing";
import { configStore } from "./state";
import Login from "./views/Login";
import Register from "./views/Register";
import Navbar from "./components/Navbar";
import Messages from "./components/Messages";
import Clubs from "./views/Clubs";
import Club from "./views/Club";

let store = configStore();

export default function App() {
    return (
        <SafeAreaView>
            <Provider store={store}>
                <Router>

                    <View>
                        <Navbar />
                        <View style={{ margin: 10 }}>
                            <Messages />
                            <Switch>
                                <Route exact path="/">
                                </Route>
                                <Route exact path="/login">
                                    <Login />
                                </Route>
                                <Route exact path="/register">
                                    <Register />
                                </Route>
                                <Route exact path="/club">
                                    <Clubs />
                                </Route>
                                <Route exact path="/club/:clubID" render={(match) => <Club match={match} />} />
                                <Route exact path="/club/training-sessions/edit">
                                </Route>
                                <Route exact path="/club/training-sessions/livestream">
                                </Route>
                            </Switch>
                        </View>
                    </View>
                </Router>
            </Provider>
        </SafeAreaView>
    );
}
