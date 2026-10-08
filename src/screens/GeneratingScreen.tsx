// El Gouna Film Festival Photo Booth — AI Generation Screen

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooth } from '../context/BoothContext';
import { generateImage, uploadImage } from '../api/client';



interface GeneratingScreenProps {
  onComplete: () => void;
  onError: (err: string) => void;
}

const GENERATION_STEPS_AR = [
  'تحليل صورتك...',
  'دمج الملصق...',
  'إضافة اللمسات الفنية...',
  'الانتهاء من تحفتك...',
];

const GENERATION_STEPS_EN = [
  'Analyzing your photo...',
  'Merging with poster...',
  'Adding artistic touches...',
  'Finalizing your masterpiece...',
];

export function GeneratingScreen({ onComplete, onError }: GeneratingScreenProps) {
  const { state, setGeneratedImage, setImageUrl, setQrUrl } = useBooth();
  const { language, capturedPhoto, selectedMovie } = state.session;
  const isAr = language === 'ar';

  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasFired, setHasFired] = useState(false);

  const steps = isAr ? GENERATION_STEPS_AR : GENERATION_STEPS_EN;

  // Animate progress bar and step text
  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];

    // Advance steps every ~4s
    const stepInterval = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, steps.length - 1));
    }, 4500);
    intervals.push(stepInterval);

    // Animate progress bar slowly to ~90% then let generation complete it
    let prog = 0;
    const progressInterval = setInterval(() => {
      prog += Math.random() * 3 + 1;
      setProgress(Math.min(prog, 88));
    }, 500);
    intervals.push(progressInterval);

    return () => intervals.forEach(clearInterval);
  }, [steps.length]);

  // Fire generation once
  useEffect(() => {
    if (hasFired || !capturedPhoto || !selectedMovie) return;
    setHasFired(true);

    (async () => {
      try {
        const result = await generateImage(
          capturedPhoto,
          selectedMovie.id,
          selectedMovie.aiPrompt,
          state.session.id,
        );

        const generatedDataUrl = `data:${result.mimeType};base64,${result.imageBase64}`;
        setGeneratedImage(generatedDataUrl);
        setProgress(100);

        // Upload image to storage
        try {
          const imageUrl = await uploadImage(generatedDataUrl);
          setImageUrl(imageUrl);
          // QR URL goes to the mobile download page
          const qrUrl = `${window.location.origin}/photo/${state.session.id}?url=${encodeURIComponent(imageUrl)}`;
          setQrUrl(qrUrl);
        } catch (uploadErr) {
          console.warn('Upload failed, using local image:', uploadErr);
          // Fall back to local session-based QR
          const qrUrl = `${window.location.origin}/photo/${state.session.id}`;
          setQrUrl(qrUrl);
        }

        setTimeout(onComplete, 600);
      } catch (err: any) {
        console.error('Generation error:', err);
        onError(err.message || (isAr ? 'فشل إنشاء الصورة' : 'Generation failed'));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFired]);

  return (
    <div className="booth-screen" data-testid="screen-generating" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0806 0%, #120e08 100%)',
      }} />

      {/* Animated ambient glow */}
      <motion.div
        className="ambient-glow"
        style={{
          width: '80%', height: '80%',
          background: 'radial-gradient(circle, #c9a227 0%, transparent 70%)',
          top: '10%', left: '10%',
          position: 'absolute',
          opacity: 0.05,
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px',
        gap: '32px',
      }}>
        {/* Film reel animation */}
        <motion.div
          style={{
            display: 'flex', gap: '6px', alignItems: 'center',
          }}
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: '52px', height: '68px',
                background: i % 2 === 0 ? 'rgba(201,162,39,0.12)' : 'rgba(201,162,39,0.06)',
                borderRadius: '2px',
                border: '1px solid rgba(201,162,39,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: i === 4 ? [1, 1.05, 1] : [0.95, 1, 0.95],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            >
              {/* Center frame: show user photo or poster */}
              {i === 4 && capturedPhoto && (
                <img src={capturedPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
              )}
              {i === 3 && selectedMovie && (
                <img src={selectedMovie.posterPath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* AI merge visual */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* User photo */}
          {capturedPhoto && (
            <motion.div
              style={{
                width: '80px', height: '100px',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid rgba(201,162,39,0.4)',
              }}
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={capturedPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          )}

          {/* Merge animation */}
          <motion.div
            style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {['✦', '→', '✦'].map((s, i) => (
              <motion.span
                key={i}
                style={{ color: 'var(--c-gold)', fontSize: i === 1 ? '1.4rem' : '0.9rem' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          {/* Poster */}
          {selectedMovie && (
            <motion.div
              style={{
                width: '80px', height: '100px',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid rgba(201,162,39,0.4)',
                background: '#2a1a0e',
              }}
              animate={{ x: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={selectedMovie.posterPath}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-arabic)', fontSize: '0.6rem',
                color: 'var(--c-gold)', textAlign: 'center', padding: '4px',
                direction: 'rtl',
              }}>
                {selectedMovie.titleAr}
              </div>
            </motion.div>
          )}
        </div>

        {/* Main text */}
        <div style={{ textAlign: 'center' }}>
          <motion.h1
            style={{
              fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: 'var(--c-cream)',
              fontWeight: isAr ? 700 : 600,
              marginBottom: '12px',
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isAr ? 'جاري إنشاء صورتك...' : 'Creating Your Image...'}
          </motion.h1>

          <div className="gold-divider" style={{ margin: '16px auto' }} />

          {/* Step text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              style={{
                fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--c-cream-dim)',
                direction: isAr ? 'rtl' : 'ltr',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {steps[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div className="gen-progress-bar">
            <motion.div
              className="gen-progress-fill"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            marginTop: '8px',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(201,162,39,0.5)' }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Cinematic quote */}
        <motion.p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            color: 'rgba(201,162,39,0.4)',
            textAlign: 'center',
            maxWidth: '400px',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {isAr
            ? '"السينما هي آلة الزمن" — مهرجان الجونة السينمائي'
            : '"Cinema is a mirror of time" — El Gouna Film Festival'}
        </motion.p>
      </div>
    </div>
  );
}
