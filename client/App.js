import React from 'react';
import {Text, View} from 'react-native';
import {Provider} from "react-redux";
import {Route, Router, Switch} from "./routing/routing";
import {configStore} from "./state";

let store = configStore();

export default function App() {
    return (
        <Provider store={store}>
            <View>
                <Text>d3bate</Text>
                <Router>
                    <Switch>
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
        </Provider>
    );
}
