// El Gouna Film Festival Photo Booth — Camera Screen
// Adapted from the old AI Memory Photobooth camera implementation

import { useState, useRef, useCallback, useEffect } from 'react';
import { BoothButton } from '../components/BoothButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooth } from '../context/BoothContext';
import { compressImage } from '../api/client';

const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

interface CameraScreenProps {
  onBack: () => void;
  onCaptured: () => void;
}

export function CameraScreen({ onBack, onCaptured }: CameraScreenProps) {
  const { state, setCapturedPhoto } = useBooth();
  const { language, selectedMovie } = state.session;
  const isAr = language === 'ar';

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setLocalCapturedPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isMirrored] = useState(true);

  // Start camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('المتصفح يمنع فتح الكاميرا (تأكد أنك تستخدم HTTPS أو Localhost)');
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(isAr
          ? 'تم رفض إذن الكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح'
          : 'Camera permission denied. Please allow camera access in browser settings');
      } else if (err.name === 'NotFoundError') {
        setCameraError(isAr ? 'لا توجد كاميرا متاحة' : 'No camera found');
      } else {
        setCameraError(err.message || (isAr ? 'حدث خطأ في الكاميرا' : 'Camera error occurred'));
      }
    }
  }, [isAr]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Capture photo from video
  const captureFromVideo = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // قص الصورة لنسبة 3:4 زي الإطار اللي المستخدم شايفه
    const targetRatio = 3 / 4;
    let sw = vw, sh = vh, sx = 0, sy = 0;
    if (vw / vh > targetRatio) {
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    canvas.width = sw;
    canvas.height = sh;
    // من غير قلب مرايا: الصورة المبعوتة للـ AI هي الوش الحقيقي
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const compressed = await compressImage(dataUrl, 1280, 0.9);

    setLocalCapturedPhoto(compressed);
    stopCamera();
  }, [stopCamera]);

  // Countdown then capture
  const startCountdown = useCallback(() => {
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(null);
        captureFromVideo();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [captureFromVideo]);

  // Retake
  const handleRetake = useCallback(() => {
    setLocalCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  // Confirm captured photo
  const handleConfirm = useCallback(async () => {
    if (!capturedPhoto) return;
    setCapturedPhoto(capturedPhoto);
    onCaptured();
  }, [capturedPhoto, setCapturedPhoto, onCaptured]);

  return (
    <div className="booth-screen" data-testid="screen-camera" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0806 0%, #12100a 100%)',
      }} />

      {/* Corner decorations */}
      <div className="corner-decor tl" />
      <div className="corner-decor tr" />
      <div className="corner-decor bl" />
      <div className="corner-decor br" />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        padding: '40px 48px',
        gap: '20px',
      }}>
        {/* Header */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={spring}
        >
          <BoothButton
            className="btn-cinematic btn-ghost"
            onClick={() => { stopCamera(); onBack(); }}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            data-testid="btn-back"
          >
            {isAr ? '← رجوع' : '← Back'}
          </BoothButton>

          <div className="progress-steps">
            <div className="progress-dot done" />
            <div className="progress-line done" />
            <div className="progress-dot done" />
            <div className="progress-line done" />
            <div className="progress-dot active" />
            <div className="progress-line" />
            <div className="progress-dot" />
          </div>

          <div style={{ width: '80px' }} />
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ textAlign: 'center', flexShrink: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h1 style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)',
            color: 'var(--c-cream)',
            fontWeight: isAr ? 700 : 600,
          }}>
            {capturedPhoto
              ? (isAr ? 'هل هذا جيد؟' : 'Is this good?')
              : (isAr ? 'التقط صورتك' : 'Take Your Photo')}
          </h1>
          <p style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--c-cream-dim)',
            marginTop: '6px',
          }}>
            {capturedPhoto
              ? (isAr ? 'يمكنك الاحتفاظ بها أو إعادة التقاطها' : 'Keep it or retake')
              : (isAr ? 'وجهك للكاميرا، من غير كاب، وإضاءة واضحة من قدام' : 'Face the camera, no cap, with clear light from the front')}
          </p>
        </motion.div>

        {/* Camera / Preview Area */}
        <motion.div
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          <div style={{
            position: 'relative',
            height: '100%',
            maxHeight: '65vh',
            aspectRatio: '3 / 4',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 16px 60px rgba(0,0,0,0.7)',
            border: '1px solid rgba(201,162,39,0.3)',
          }}>
            {/* Video feed (live camera) */}
            {!capturedPhoto && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transform: isMirrored ? 'scaleX(-1)' : 'none',
                  display: cameraReady ? 'block' : 'none',
                }}
                data-testid="camera-video"
              />
            )}

            {/* Captured photo */}
            {capturedPhoto && (
              <img
                src={capturedPhoto}
                alt={isAr ? 'الصورة الملتقطة' : 'Captured photo'}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: isMirrored ? 'scaleX(-1)' : 'none',
                }}
                data-testid="captured-photo"
              />
            )}

            {/* Camera loading state */}
            {!cameraReady && !capturedPhoto && !cameraError && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'var(--c-charcoal)',
                gap: '16px',
              }}>
                <div className="cine-spinner" />
                <span style={{ color: 'var(--c-cream-dim)', fontSize: '0.85rem' }}>
                  {isAr ? 'جاري تشغيل الكاميرا...' : 'Starting camera...'}
                </span>
              </div>
            )}

            {/* Camera error */}
            {cameraError && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'var(--c-charcoal)',
                padding: '24px', textAlign: 'center', gap: '16px',
              }}>
                <div style={{ fontSize: '3rem' }}>📷</div>
                <p style={{
                  color: 'var(--c-cream-dim)',
                  fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  direction: isAr ? 'rtl' : 'ltr',
                }}>
                  {cameraError}
                </p>
                <BoothButton className="btn-cinematic" onClick={startCamera} style={{ fontSize: '0.85rem', padding: '10px 24px' }}>
                  {isAr ? 'إعادة المحاولة' : 'Retry'}
                </BoothButton>
              </div>
            )}

            {/* Camera frame guide overlay */}
            {cameraReady && !capturedPhoto && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                
                {/* Corner frame markers */}
                {[
                  { top: '6%', left: '6%', borderWidth: '2px 0 0 2px' },
                  { top: '6%', right: '6%', borderWidth: '2px 2px 0 0' },
                  { bottom: '6%', left: '6%', borderWidth: '0 0 2px 2px' },
                  { bottom: '6%', right: '6%', borderWidth: '0 2px 2px 0' },
                ].map((style, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    width: '30px', height: '30px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(201,162,39,0.7)',
                    ...style,
                  }} />
                ))}

                              </div>
            )}

            {/* Countdown overlay */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  className="camera-countdown"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={countdown}
                >
                  <motion.div
                    className="countdown-number"
                    key={`count-${countdown}`}
                    initial={{ scale: 1.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {countdown}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Selected movie reminder */}
        {selectedMovie && !capturedPhoto && (
          <motion.div
            style={{
              flexShrink: 0,
              textAlign: 'center',
              padding: '10px',
              background: 'rgba(201,162,39,0.06)',
              border: '1px solid rgba(201,162,39,0.15)',
              borderRadius: '2px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span style={{
              fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--c-cream-dim)',
            }}>
              {isAr ? 'ستُدمج صورتك مع ملصق:' : 'Your photo will merge with:'}{' '}
              <strong style={{ color: 'var(--c-gold)' }}>
                {isAr ? selectedMovie.titleAr : selectedMovie.titleEn}
              </strong>
            </span>
          </motion.div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Action Buttons */}
        <motion.div
          style={{
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          {capturedPhoto ? (
            <>
              <BoothButton
                className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
                onClick={handleConfirm}
                style={{ width: '100%', padding: '20px' }}
                data-testid="btn-use-photo"
              >
                {isAr ? 'استخدام الصورة ✦' : '✦ Use This Photo'}
              </BoothButton>
              <BoothButton
                className={`btn-cinematic btn-ghost ${isAr ? 'btn-arabic' : ''}`}
                onClick={handleRetake}
                style={{ width: '100%', padding: '16px' }}
                data-testid="btn-retake"
              >
                {isAr ? 'إعادة التقاط الصورة' : 'Retake Photo'}
              </BoothButton>
            </>
          ) : (
            <BoothButton
              className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
              onClick={startCountdown}
              disabled={!cameraReady || countdown !== null}
              style={{ width: '100%', padding: '20px' }}
              data-testid="btn-capture"
            >
              {countdown !== null
                ? (isAr ? `التقاط خلال ${countdown}...` : `Capturing in ${countdown}...`)
                : (isAr ? '📸 التقاط الصورة' : '📸 Capture Photo')}
            </BoothButton>
          )}
        </motion.div>
      </div>
    </div>
  );
}
