import React from 'react';

class Dashboard extends React.Component {
    render() {
        return <>
            <div className="center row">
                <img className="col-25" width="25%"
                     style={{verticalAlign: 'middle'}}
                     src="https://rawcdn.githack.com/d3bate/d3bate/fe333a28717a3b1588d3abb5fe22311c49c95201/assets/illustrations/debator-and-podium.jpg"/>
                <div className="col-75" style={{textAlign: 'left', paddingTop: "12%"}}>
                    <h1>D3BATE</h1>
                    <h3>A digital debating toolkit.</h3>
                </div>
            </div>
            <hr style={{width: "75%"}}/>
        </>
    }
}

export {Dashboard}
