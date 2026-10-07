// El Gouna Film Festival Photo Booth — Result Screen


import { BoothButton } from '../components/BoothButton';
import { motion } from 'framer-motion';
import { useBooth } from '../context/BoothContext';

const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

interface ResultScreenProps {
  onRegenerate: () => void;
  onEdit: () => void;
  onContinue: () => void;
}

export function ResultScreen({ onRegenerate, onEdit, onContinue }: ResultScreenProps) {
  const { state } = useBooth();
  const { language, generatedImage, selectedMovie } = state.session;
  const isAr = language === 'ar';

  return (
    <div className="booth-screen" data-testid="screen-result" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0806 0%, #1a1208 50%, #0a0806 100%)',
      }} />

      {/* Ambient celebration glow */}
      <motion.div
        className="ambient-glow"
        style={{
          width: '70%', height: '70%',
          background: 'radial-gradient(circle, #c9a227 0%, transparent 70%)',
          top: '15%', left: '15%',
          opacity: 0.08,
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Corner decorations */}
      <div className="corner-decor tl" />
      <div className="corner-decor tr" />
      <div className="corner-decor bl" />
      <div className="corner-decor br" />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 48px',
        gap: '20px',
      }}>
        {/* Progress indicator */}
        <motion.div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="progress-steps">
            <div className="progress-dot done" />
            <div className="progress-line done" />
            <div className="progress-dot done" />
            <div className="progress-line done" />
            <div className="progress-dot done" />
            <div className="progress-line done" />
            <div className="progress-dot active" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ textAlign: 'center', flexShrink: 0 }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={spring}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201,162,39,0.6)',
            marginBottom: '8px',
          }}>
            {isAr ? 'تحفتك الفنية' : 'Your Masterpiece'}
          </div>
          <h1 style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            color: 'var(--c-cream)',
            fontWeight: isAr ? 700 : 600,
            lineHeight: 1.2,
          }}>
            {isAr ? 'أنت الآن نجم الفيلم! ✦' : '✦ You Are Now the Star!'}
          </h1>
          <div className="gold-divider" style={{ marginTop: 12 }} />
        </motion.div>

        {/* Generated Image — hero */}
        <motion.div
          style={{
            flex: 1, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 0,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.15 }}
        >
          <div style={{
            position: 'relative',
            display: 'inline-flex',
            maxWidth: '100%',
            borderRadius: '2px',
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(201,162,39,0.2)',
            border: '2px solid rgba(201,162,39,0.5)',
          }}>
            {generatedImage ? (
              <img
                src={generatedImage}
                alt={isAr ? 'صورتك المُنشأة' : 'Your generated photo'}
                style={{
                  display: 'block',
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '55vh',
                }}
                data-testid="generated-image"
              />
            ) : (
              /* Fallback if no image */
              <div style={{
                width: 'min(60vw, 330px)',
                aspectRatio: '2 / 3',
                background: 'linear-gradient(135deg, #2a1a0e, #1a0e2a)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '16px',
              }}>
                <div style={{ fontSize: '4rem' }}>🎬</div>
                <div style={{
                  fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
                  color: 'var(--c-gold)',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                }}>
                  {isAr ? selectedMovie?.titleAr : selectedMovie?.titleEn}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Movie label */}
        {selectedMovie && (
          <motion.div
            style={{
              flexShrink: 0, textAlign: 'center',
              padding: '10px 24px',
              background: 'rgba(201,162,39,0.08)',
              border: '1px solid rgba(201,162,39,0.2)',
              borderRadius: '2px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span style={{
              fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--c-gold)',
              fontStyle: isAr ? 'normal' : 'italic',
            }}>
              {isAr ? selectedMovie.titleAr : selectedMovie.titleEn}
            </span>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          style={{
            flexShrink: 0, width: '100%',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.35 }}
        >
          {/* Primary: Get my photo → QR */}
          <BoothButton
            className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
            onClick={onContinue}
            style={{ width: '100%', padding: '20px' }}
            data-testid="btn-get-photo"
          >
            {isAr ? '✦ احصل على صورتك' : '✦ Get My Photo'}
          </BoothButton>

          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Edit */}
            <BoothButton
              className={`btn-cinematic ${isAr ? 'btn-arabic' : ''}`}
              onClick={onEdit}
              style={{ flex: 1, padding: '14px' }}
              data-testid="btn-edit"
            >
              {isAr ? 'تعديل' : 'Edit'}
            </BoothButton>

            {/* Regenerate */}
            <BoothButton
              className={`btn-cinematic btn-ghost ${isAr ? 'btn-arabic' : ''}`}
              onClick={onRegenerate}
              style={{ flex: 1, padding: '14px' }}
              data-testid="btn-regenerate"
            >
              {isAr ? 'إعادة' : 'Regenerate'}
            </BoothButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
