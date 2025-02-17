
const enableButton = document.getElementById("enableMotion");
const stopButton = document.getElementById("stopMotion");
const saveCSVButton = document.getElementById("saveCSV");
const saveCSVBottomButton = document.getElementById("saveCSVBottom");
const tableBody = document.querySelector("#sensorTable tbody");

let sensorInterval = null;
let recordedData = [];
let lastAcceleration = null;

// Chart setup
const ctx = document.getElementById("sensorChart").getContext("2d");
const chartData = {
  labels: [], // Time points
  datasets: [
    { label: "X (m/s²)", borderColor: "red", data: [], fill: false },
    { label: "Y (m/s²)", borderColor: "green", data: [], fill: false },
    { label: "Z (m/s²)", borderColor: "blue", data: [], fill: false },
  ],
};
const sensorChart = new Chart(ctx, {
  type: "line",
  data: chartData,
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Timestamp" } },
      y: { title: { display: true, text: "Acceleration (m/s²)" } },
    },
  },
});

// Request permission and start motion sensor
enableButton.addEventListener("click", function () {
  if (!("DeviceMotionEvent" in window)) {
    alert("No inertial sensors detected. Please try on a mobile device.");
    return;
  }

  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          startStreaming();
        } else {
          alert("Permission denied for motion sensors.");
        }
      })
      .catch((error) => {
        alert("Error requesting motion sensor permission: " + error);
      });
  } else {
    startStreaming();
  }
});

// Start streaming accelerometer data at 10Hz
function startStreaming() {
  if (sensorInterval) clearInterval(sensorInterval);

  recordedData = [];

  window.addEventListener("devicemotion", handleMotionData);

  sensorInterval = setInterval(() => {
    if (lastAcceleration) {
      updateTable(lastAcceleration);
      updateChart(lastAcceleration);
      recordedData.push(lastAcceleration);
    }
  }, 100);

  stopButton.disabled = false;
  saveCSVButton.disabled = true;
  saveCSVBottomButton.disabled = true;
  enableButton.disabled = true;
}

function stopStreaming() {
  clearInterval(sensorInterval);
  window.removeEventListener("devicemotion", handleMotionData);

  stopButton.disabled = true;
  saveCSVButton.disabled = false;
  saveCSVBottomButton.disabled = false;
  enableButton.disabled = false;
}

stopButton.addEventListener("click", stopStreaming);

function handleMotionData(event) {
  lastAcceleration = {
    timestamp: new Date().toLocaleTimeString(),
    x: event.acceleration.x ? event.acceleration.x.toFixed(3) : "N/A",
    y: event.acceleration.y ? event.acceleration.y.toFixed(3) : "N/A",
    z: event.acceleration.z ? event.acceleration.z.toFixed(3) : "N/A",
  };
}

// Update table
function updateTable(accelData) {
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td>${accelData.timestamp}</td>
    <td>${accelData.x}</td>
    <td>${accelData.y}</td>
    <td>${accelData.z}</td>
  `;

  tableBody.insertBefore(newRow, tableBody.firstChild);

  if (tableBody.rows.length > 10) {
    tableBody.removeChild(tableBody.lastChild);
  }
}

// Update chart
function updateChart(accelData) {
  if (chartData.labels.length >= 50) {
    chartData.labels.shift();
    chartData.datasets.forEach((dataset) => dataset.data.shift());
  }

  chartData.labels.push(accelData.timestamp);
  chartData.datasets[0].data.push(accelData.x);
  chartData.datasets[1].data.push(accelData.y);
  chartData.datasets[2].data.push(accelData.z);

  sensorChart.update();
}

// Save CSV
function saveCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Timestamp,X (m/s²),Y (m/s²),Z (m/s²)\n";

  recordedData.forEach((row) => {
    csvContent += `${row.timestamp},${row.x},${row.y},${row.z}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sensor_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

saveCSVButton.addEventListener("click", saveCSV);
saveCSVBottomButton.addEventListener("click", saveCSV);



// const enableButton = document.getElementById("enableMotion");
// const stopButton = document.getElementById("stopMotion");
// const saveCSVButton = document.getElementById("saveCSV");
// const tableBody = document.querySelector("#sensorTable tbody");

// let sensorInterval = null;
// let recordedData = []; // Array to store recorded sensor data

// // Request permission and start motion sensor
// enableButton.addEventListener("click", function () {
//   if (!("DeviceMotionEvent" in window)) {
//     alert("No inertial sensors detected. Please try on a mobile device.");
//     return;
//   }

//   if (typeof DeviceMotionEvent.requestPermission === "function") {
//     DeviceMotionEvent.requestPermission()
//       .then((permissionState) => {
//         if (permissionState === "granted") {
//           startStreaming();
//         } else {
//           alert("Permission denied for motion sensors.");
//         }
//       })
//       .catch((error) => {
//         alert("Error requesting motion sensor permission: " + error);
//       });
//   } else {
//     startStreaming();
//   }
// });

// // Start streaming accelerometer data at 10Hz
// function startStreaming() {
//   if (sensorInterval) clearInterval(sensorInterval);

//   recordedData = []; // Clear previous recordings

//   window.addEventListener("devicemotion", handleMotionData);

//   // Stream at 10Hz (every 100ms)
//   sensorInterval = setInterval(() => {
//     if (lastAcceleration) {
//       updateTable(lastAcceleration);
//       recordedData.push(lastAcceleration); // Save the recorded data
//     }
//   }, 100);

//   // Enable stop and save buttons
//   stopButton.disabled = false;
//   saveCSVButton.disabled = true;
//   enableButton.disabled = true;
// }

// function stopStreaming() {
//   clearInterval(sensorInterval);
//   window.removeEventListener("devicemotion", handleMotionData);

//   // Enable save button, disable stop
//   stopButton.disabled = true;
//   saveCSVButton.disabled = false;
//   enableButton.disabled = false;
// }

// stopButton.addEventListener("click", stopStreaming);

// let lastAcceleration = null; // Only declare it once

// // Handle motion data
// function handleMotionData(event) {
//   lastAcceleration = {
//     timestamp: new Date().toISOString(),
//     x: event.acceleration.x ? event.acceleration.x.toFixed(3) : "N/A",
//     y: event.acceleration.y ? event.acceleration.y.toFixed(3) : "N/A",
//     z: event.acceleration.z ? event.acceleration.z.toFixed(3) : "N/A",
//   };
// }

// // Update table dynamically
// function updateTable(accelData) {
//   const newRow = document.createElement("tr");

//   newRow.innerHTML = `
//     <td>${accelData.timestamp}</td>
//     <td>${accelData.x}</td>
//     <td>${accelData.y}</td>
//     <td>${accelData.z}</td>
//   `;

//   tableBody.insertBefore(newRow, tableBody.firstChild);

//   if (tableBody.rows.length > 10) {
//     tableBody.removeChild(tableBody.lastChild);
//   }
// }

// // Save recorded data as CSV
// saveCSVButton.addEventListener("click", function () {
//   if (recordedData.length === 0) {
//     alert("No data recorded.");
//     return;
//   }

//   let csvContent = "data:text/csv;charset=utf-8,";
//   csvContent += "Timestamp,X (m/s²),Y (m/s²),Z (m/s²)\n"; // Header row

//   recordedData.forEach((row) => {
//     csvContent += `${row.timestamp},${row.x},${row.y},${row.z}\n`;
//   });

//   const encodedUri = encodeURI(csvContent);
//   const link = document.createElement("a");
//   link.setAttribute("href", encodedUri);
//   link.setAttribute("download", "sensor_data.csv");
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// });
