import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

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
    videoRef.current.srcObject = stream;

    // ✅ Wait until video loads
    videoRef.current.onloadedmetadata = () => {
      setCameraReady(true);
    };

  } catch (err) {
    alert("Camera permission denied");
  }
};

  // 📷 Capture from webcam
  const captureImage = async () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;

  // ✅ SAFETY CHECK
  if (!canvas || !video) {
    alert("Camera not started properly");
    return;
  }

  // ✅ CHECK 2: video is ready
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    alert("Please wait, camera is still loading...");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL("image/png");

  const formData = new FormData();
  formData.append("cam_image", imageData);

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

      <video ref={videoRef} autoPlay width="250"></video>

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
  disabled={!cameraReady}
  style={{
    background: cameraReady ? "red" : "gray",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: cameraReady ? "pointer" : "not-allowed"
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