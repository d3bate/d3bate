import React from "react";
import {View} from "react-native";
import {Camera} from "expo-camera";
import * as FaceDetector from "expo-face-detector";


class TrainingSessionLivestream extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <View>
                <Camera zoom={} ratio={} focusDepth={} onMountError={} pictureSize={} onCameraReady={} useCamera2Api={}
                        onBarCodeScanned={} barCodeScannerSettings={} onFacesDetected={faces => {

                }} faceDetectorSettings={{
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
