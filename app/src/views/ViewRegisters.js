import React from 'react';
import {observer} from 'mobx-react';
import {registerDocuments} from "../sync/models/register";


export const ViewRegisters = observer(class ViewRegisters extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <>
            <div>

            </div>
            {registerDocuments.docs.map((registerDoc, docIndex) => {
                return <div key={docIndex}>
                    <h1>{registerDoc}</h1>
                </div>
            })}
        </>
    }
});