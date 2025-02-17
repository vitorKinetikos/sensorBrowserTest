const outputDiv = document.getElementById('output');
const enableButton = document.getElementById('enableMotion');

// Helper function to print messages on the page
function logToPage(message) {
  const p = document.createElement('p');
  p.textContent = message;
  outputDiv.appendChild(p);
}

// Clear output before logging new data (optional)
function clearOutput() {
  outputDiv.innerHTML = '';
}

// Initialize motion sensor event listener
function startMotionSensor() {
  let sensorTriggered = false;

  // Fallback: If no sensor data is received within 5 seconds, show a message.
  const sensorTimeout = setTimeout(() => {
    if (!sensorTriggered) {
      logToPage("No sensor data detected. It might be that your device does not support inertial sensors, or sensor data isn't available.");
    }
  }, 5000);

  window.addEventListener('devicemotion', event => {
    sensorTriggered = true;
    clearTimeout(sensorTimeout);

    // Get acceleration values
    const acceleration = event.acceleration;
    const accelerationG = event.accelerationIncludingGravity;
    const rotationRate = event.rotationRate;

    // Display the sensor data on the page
    logToPage('Acceleration: ' + JSON.stringify(acceleration));
    logToPage('Acceleration including gravity: ' + JSON.stringify(accelerationG));
    logToPage('Rotation rate: ' + JSON.stringify(rotationRate));
  });
}

// Handle button click event
enableButton.addEventListener('click', function () {
  clearOutput();

  // Check if inertial sensors are supported
  if (!('DeviceMotionEvent' in window)) {
    logToPage("No inertial sensors detected on this device. Please try this page on a compatible mobile device.");
    return;
  }

  // Check for permission requirement (iOS 13+)
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          logToPage('Motion sensor permission granted.');
          startMotionSensor();
        } else {
          logToPage('Permission not granted for motion sensors.');
        }
      })
      .catch(error => {
        logToPage('Error requesting motion sensor permission: ' + error);
      });
  } else {
    // For browsers that don't require permission
    startMotionSensor();
  }
});