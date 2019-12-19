import React from 'react';
import {observer} from 'mobx-react';


export const TakeRegister = observer(class TakeRegister extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <>
            <div className="row">
                <div className="col-25" style={{textAlign: 'center'}}>
                    <h5>AREA UNDER CONSTRUCTION.</h5>
                </div>
            </div>
        </>
    }
});
