import React from "react";
import {Switch, Text, View} from "react-native";
import {Camera} from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import {backendWebsocketURL} from "../constants";
import {Path, Svg} from "react-native-svg";


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
        this.websocket = new WebSocket(`${backendWebsocketURL}`);
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
                {this.state.others.length > 0 ? this.state.others.map(
                    (other, otherIndex) => {
                        return <View key={otherIndex}><Svg><Path/></Svg></View>
                    }
                ) : <Text>There are no other people in this debate.</Text>}
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
