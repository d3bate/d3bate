import React from 'react';
import {Text, View} from 'react-native';

import {Route, Router, Switch} from "routing";

export default function App() {
    return (
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
    );
}
