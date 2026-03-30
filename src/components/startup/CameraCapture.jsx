import { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check } from 'lucide-react';

export const CameraCapture = ({ onCapture, disabled }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Add timestamp watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(new Date().toLocaleString(), 10, canvas.height - 15);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
    onCapture(dataUrl);
  }, [stopCamera, onCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  return (
    <div className="camera-container">
      {error && (
        <div className="camera-error">
          <p>{error}</p>
          <button className="btn-primary" onClick={startCamera}>Retry</button>
        </div>
      )}

      {!cameraActive && !capturedImage && !error && (
        <div className="camera-placeholder" onClick={!disabled ? startCamera : undefined}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
          <Camera size={40} style={{ color: 'var(--blue-300)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.75rem' }}>Open Camera</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Required for attendance verification</p>
        </div>
      )}

      {cameraActive && (
        <div className="camera-live">
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: 'var(--radius-md)', transform: 'scaleX(-1)' }} />
          <div className="camera-actions">
            <button className="btn-primary" onClick={capturePhoto} style={{ padding: '0.75rem 2rem' }}>
              <Camera size={18} /> Capture Photo
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="camera-preview">
          <img src={capturedImage} alt="Captured Proof" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
          <div className="camera-actions" style={{ marginTop: '0.75rem' }}>
            <button className="btn-secondary" onClick={retake}><RefreshCw size={15} /> Retake</button>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>
              <Check size={16} /> Photo captured
            </span>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
