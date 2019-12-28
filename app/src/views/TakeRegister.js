import React from 'react';
import {observer} from 'mobx-react';
import {registerDocuments} from "../sync/models/register";
import {AreaUnderConstruction} from "../components/AreaUnderConstruction";


export const TakeRegister = observer(class TakeRegister extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <>
            <AreaUnderConstruction/>
        </>
    }
});
