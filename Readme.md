# IMU Sensor Data Collection via Browser

This project tests whether we can collect **IMU sensor data** from a smartphone browser, without needing to install an app. 
The goal is to access motion and orientation data (accelerometer, gyroscope) using built-in web APIs.

## How It Works
- Uses `DeviceMotionEvent` and `DeviceOrientationEvent` to read sensor data.
- Runs in a web page, so no app installation is required.
- Displays live IMU data after the user grants permission.

## Getting Started
1. Open the page in a mobile browser.
2. Grant permission when prompted.
3. Move the phone to see sensor data update.

## Live Demo
[**Try it here**](https://vitorkinetikos.github.io/sensorBrowserTest/sensorTest.html)
