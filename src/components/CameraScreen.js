import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Tflite from 'tflite-react-native';

const CameraScreen = () => {
  const [output, setOutput] = useState([]);
  const cameraRef = useRef(null);
  let tflite = new Tflite();

  useEffect(() => {
    tflite.loadModel({
      model: 'yolov8.tflite', // Path to your model
      labels: 'labels.txt',   // Path to your labels file
      numThreads: 1,          // Number of threads to use
    }, (err, res) => {
      if (err) console.log(err);
      else console.log('Model loaded successfully');
    });

    return () => {
      tflite.close();
    };
  }, []);

  const detectObjects = async (imageData) => {
    tflite.runModelOnImage({
      path: imageData.uri,
      imageMean: 127.5,
      imageStd: 127.5,
      numResults: 10,
      threshold: 0.5,
    }, (err, res) => {
      if (err) console.log(err);
      else setOutput(res);
    });
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      detectObjects(data);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      />
      <View style={styles.overlay}>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          <Text style={styles.captureText}>Detect</Text>
        </TouchableOpacity>
      </View>
      <View>
        {output.map((item, index) => (
          <Text key={index} style={styles.outputText}>
            {`${item.label} - ${item.confidence.toFixed(2)}`}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  preview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  capture: { flex: 0, backgroundColor: '#fff', padding: 15, alignSelf: 'center' },
  captureText: { fontSize: 14 },
  outputText: { fontSize: 16, color: '#000', textAlign: 'center' },
});

export default CameraScreen;
