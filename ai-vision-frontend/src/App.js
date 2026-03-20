import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 📸 Upload image
  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/detect/",
        formData
      );
      setResult(res.data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // 🎥 Start webcam
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    const video = videoRef.current;
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();

      // ✅ THIS FIXES YOUR PROBLEM
      setCameraStarted(true);
    };

  } catch (err) {
    console.log(err);
    alert("Camera error");
  }
};
  // 📷 Capture from webcam
  const captureImage = async () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;

  if (!canvas || !video) {
    alert("Camera not ready");
    return;
  }

  const ctx = canvas.getContext("2d");

  // ✅ Force fixed size (this solves most issues)
  canvas.width = 640;
  canvas.height = 480;

  ctx.drawImage(video, 0, 0, 640, 480);

  const imageData = canvas.toDataURL("image/png");

  // ✅ DEBUG (VERY IMPORTANT)
  console.log("Captured Image:", imageData.slice(0, 50));

  const formData = new FormData();
  formData.append("cam_image", imageData);

  setLoading(true);

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/detect/",
      formData
    );

    console.log("API Response:", res.data); // ✅ DEBUG
    setResult(res.data);

  } catch (err) {
    console.log("API Error:", err);
    alert("API not working");
  }

  setLoading(false);
};

  return (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    fontFamily: "Arial"
  }}>

    <h1 style={{
      color: "white",
      fontSize: "40px",
      marginBottom: "30px"
    }}>
      🤖 AI Smart Vision
    </h1>

    {/* Upload Section */}
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      marginBottom: "20px",
      textAlign: "center"
    }}>
      <h2>Upload Image</h2>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      <button
        onClick={handleUpload}
        style={{
          background: "#ff7b00",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Detect
      </button>
    </div>

    {/* Webcam Section */}
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      marginBottom: "20px",
      textAlign: "center"
    }}>
      <h2>Webcam</h2>

      {/* ✅ VIDEO */}
       <video ref={videoRef} autoPlay width="250"></video>

    {/* ✅ ADD THIS CANVAS HERE */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <br /><br />

      <button
        onClick={startCamera}
        style={{
          background: "green",
          color: "white",
          padding: "8px 15px",
          marginRight: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Start Camera
      </button>

 <button
  onClick={captureImage}
  disabled={!cameraStarted}
  style={{
    background: cameraStarted ? "red" : "gray",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: cameraStarted ? "pointer" : "not-allowed"
  }}
>
  Capture
</button>
    </div>

    {/* Loading */}
    {loading && <h3 style={{ color: "white" }}>⏳ Detecting...</h3>}

    {/* Result */}
    {result && (
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <h3 style={{ color: "#333" }}>
          {result.objects.join(", ")}
        </h3>

        <img
          src={`http://127.0.0.1:8000${result.image}`}
          width="250"
          alt="result"
        />

        <br /><br />

        <audio controls>
          <source
            src={`http://127.0.0.1:8000${result.audio}`}
            type="audio/mpeg"
          />
        </audio>
      </div>
    )}

  </div>
);
}
export default App;