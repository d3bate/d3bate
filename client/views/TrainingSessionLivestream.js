import React from "react";
import {Switch, Text, View} from "react-native";
import {Camera} from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import io from "socket.io-client"
import {backendURL} from "../constants";


class TrainingSessionLivestream extends React.Component {
    constructor(props) {
        super(props);
        this.websocket = null;
        this.state = {
            connecting: true,
            saveData: false,
            others: []
        }
    }

    componentDidMount() {
        this.websocket = io.connect(`${backendURL}/video`);
        this.state.connecting = false;
        this.websocket.on("receive_face_data", (data) => {
            let index = this.state.others.findIndex(o => o.userID === data.userID);
            if (!index) {
                this.state.others.push(data)
            }
            else {
                this.state.others[index] = data
            }
        })
    }

    componentWillUnmount() {
        this.websocket.close();
    }

    sendFaceData(faces) {
        this.websocket.emit("send_face_data", {faceCount: faces.length, faceData: faces})
    }

    render() {
        return (
            <View>
                {this.state.connecting ? <Text>Connecting...</Text> : null}
                <View>
                    <Text>Save my (face and audio) data for later review</Text>
                    <Switch value={this.state.saveData ? 1 : 0}/>
                </View>
                <Camera zoom={} ratio={} focusDepth={} onMountError={} pictureSize={} onCameraReady={} useCamera2Api={}
                        onBarCodeScanned={} barCodeScannerSettings={} onFacesDetected={this.sendFaceData}
                        faceDetectorSettings={{
                            mode: FaceDetector.Constants.Mode.fast,
                            detectLandmarks: FaceDetector.Constants.Landmarks.all,
                            runClassifications: FaceDetector.Constants.Classifications.all,
                            minDetectionInterval: 100,
                            tracking: true
                        }} type={}
                        flashMode={} videoStabilizationMode={} whiteBalance={} autoFocus={} Readonly={} name={}/>
            </View>
        );
    }

}
