import React from 'react';

class Dashboard extends React.Component {
    render() {
        return <>
            <div className="center row">
                <img className="col-25" width="25%"
                     style={{verticalAlign: 'middle'}}
                     src="https://rawcdn.githack.com/d3bate/d3bate/d238eda80086757c35dd711eec4567a452bc16bb/assets/illustrations/debater-and-podium.jpg"
                     alt={"Debater and podium"}/>
                <div className="col-75" style={{textAlign: 'left', paddingTop: "12%"}}>
                    <h1>D3BATE</h1>
                    <h3>A digital debating toolkit.</h3>
                </div>
            </div>
            <hr style={{width: "75%"}}/>
            <div className="center row">

                <div className="col-75" style={{textAlign: 'left', paddingTop: "12%"}}>
                    <h1>Upload your information (training, tournaments, etc.)</h1>
                    <h3>Stored on the Google Cloud, automatically encrypted</h3>

                </div>
                <img className="col-25" width="25%"
                     style={{verticalAlign: 'middle'}}
                     src="https://rawcdn.githack.com/d3bate/d3bate/d238eda80086757c35dd711eec4567a452bc16bb/assets/illustrations/cloud-uploader.png"
                     alt="Upload to cloud"/>
            </div>
            <hr style={{width: "75%"}}/>
            <div className="center row">
                <div className="col-75" style={{textAlign: 'left', paddingTop: "12%"}}>
                    <h1>Automatically distribute it to users.</h1>
                    <h3>Use push notifications and emails to alert users*</h3>
                    <p>* These features are currently in development</p>

                </div>
                <img className="col-25" width="25%"
                     style={{verticalAlign: 'middle'}}
                     src="https://rawcdn.githack.com/d3bate/d3bate/d238eda80086757c35dd711eec4567a452bc16bb/assets/illustrations/cloud-downloader.png"
                     alt="Download from cloud"/>
            </div>
        </>
    }
}

export {Dashboard}
