// El Gouna Film Festival Photo Booth — QR Screen
// Final screen: no printing, visitor scans QR to download


import { BoothButton } from '../components/BoothButton';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useBooth } from '../context/BoothContext';

const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

interface QRScreenProps {
  onNewExperience: () => void;
}

export function QRScreen({ onNewExperience }: QRScreenProps) {
  const { state } = useBooth();
  const { language, editedImage, generatedImage, qrUrl, selectedMovie, imageUrl } = state.session;
  const isAr = language === 'ar';

  const displayImage = editedImage || generatedImage;

  // Construct the QR URL — points to a mobile-friendly download page
  const resolvedQrUrl = qrUrl || imageUrl || `${window.location.origin}/photo/${state.session.id}`;

  return (
    <div className="booth-screen" data-testid="screen-qr" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0806 0%, #1a1208 50%, #0a0806 100%)',
      }} />

      {/* Celebration ambient glows */}
      <motion.div
        className="ambient-glow"
        style={{
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, #c9a227 0%, transparent 70%)',
          top: '0%', left: '-10%', opacity: 0.1,
          position: 'absolute',
        }}
        animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-glow"
        style={{
          width: '50%', height: '50%',
          background: 'radial-gradient(circle, #8b3a1a 0%, transparent 70%)',
          bottom: '10%', right: '-5%', opacity: 0.07,
          position: 'absolute',
        }}
        animate={{ scale: [1.2, 1, 1.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Corner decorations */}
      <div className="corner-decor tl" />
      <div className="corner-decor tr" />
      <div className="corner-decor bl" />
      <div className="corner-decor br" />

      {/* Film strips */}
      <div style={{
        position: 'absolute', top: '3%', left: 0, right: 0,
        height: '24px', display: 'flex', gap: '3px', padding: '0 3px', opacity: 0.25,
      }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, background: 'rgba(201,162,39,0.15)',
            borderRadius: '2px',
          }} />
        ))}
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '60px 48px 48px',
        gap: '20px',
      }}>
        {/* Header text */}
        <motion.div
          style={{ textAlign: 'center', flexShrink: 0 }}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={spring}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              color: 'var(--c-gold)',
              lineHeight: 1,
              marginBottom: '12px',
            }}
          >
            {isAr ? 'جاهز! ✦' : '✦ Ready!'}
          </motion.div>

          <h2 style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
            fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
            color: 'var(--c-cream)',
            fontWeight: isAr ? 600 : 500,
            marginBottom: '8px',
          }}>
            {isAr ? 'امسح الـ QR واحفظ صورتك' : 'Scan the QR code to save your photo'}
          </h2>

          <div className="gold-divider" style={{ marginTop: 14 }} />
        </motion.div>

        {/* Main content area — image + QR */}
        <motion.div
          style={{
            flex: 1, width: '100%',
            display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center',
            minHeight: 0,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          {/* Final image thumbnail */}
          {displayImage && (
            <div style={{
              height: '100%',
              maxHeight: '40vh',
              aspectRatio: '2 / 3',
              borderRadius: '2px',
              overflow: 'hidden',
              border: '2px solid rgba(201,162,39,0.5)',
              boxShadow: '0 16px 60px rgba(0,0,0,0.7), 0 0 40px rgba(201,162,39,0.15)',
              flexShrink: 0,
            }}>
              <img
                src={displayImage}
                alt={isAr ? 'صورتك' : 'Your photo'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* QR Code */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '16px',
          }}>
            {/* QR wrapper with gold border */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(201,162,39,0.3)',
                  '0 0 40px rgba(201,162,39,0.5)',
                  '0 0 20px rgba(201,162,39,0.3)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                background: 'var(--c-cream)',
                padding: '16px',
                borderRadius: '4px',
                border: '3px solid rgba(201,162,39,0.6)',
              }}
            >
              <QRCodeSVG
                value={resolvedQrUrl}
                size={180}
                bgColor="#f0e6cc"
                fgColor="#0a0806"
                level="H"
                includeMargin={false}
                data-testid="qr-code"
              />
            </motion.div>

            {/* URL hint */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'rgba(201,162,39,0.5)',
              textAlign: 'center',
              maxWidth: '200px',
              wordBreak: 'break-all',
            }}>
              {resolvedQrUrl}
            </p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          style={{
            flexShrink: 0, textAlign: 'center',
            padding: '16px 24px',
            background: 'rgba(201,162,39,0.06)',
            border: '1px solid rgba(201,162,39,0.2)',
            borderRadius: '2px',
            width: '100%',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          <p style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--c-cream-dim)',
            lineHeight: 1.6,
            direction: isAr ? 'rtl' : 'ltr',
          }}>
            {isAr
              ? '📱 وجّه كاميرا هاتفك نحو رمز QR لتنزيل صورتك وحفظها'
              : '📱 Point your phone camera at the QR code to download and save your photo'}
          </p>
        </motion.div>

        {/* Movie credit */}
        {selectedMovie && (
          <motion.div
            style={{ textAlign: 'center', flexShrink: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span style={{
              fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
              fontSize: '0.9rem',
              color: 'rgba(201,162,39,0.6)',
              fontStyle: isAr ? 'normal' : 'italic',
            }}>
              {isAr ? `من فيلم: ${selectedMovie.titleAr}` : `From: ${selectedMovie.titleEn}`}
            </span>
          </motion.div>
        )}

        {/* New Experience Button */}
        <motion.div
          style={{ flexShrink: 0, width: '100%' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.6 }}
        >
          <BoothButton
            className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
            onClick={onNewExperience}
            style={{ width: '100%', padding: '20px' }}
            data-testid="btn-new-experience"
          >
            {isAr ? '✦ تجربة جديدة' : '✦ New Experience'}
          </BoothButton>
        </motion.div>

        {/* Festival branding footer */}
        <motion.div
          style={{ textAlign: 'center', flexShrink: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(201,162,39,0.4)',
          }}>
            El Gouna Film Festival {new Date().getFullYear()}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
