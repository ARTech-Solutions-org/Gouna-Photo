
import { motion, AnimatePresence } from 'framer-motion';
import { useBooth } from '../context/BoothContext';

const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

// In this design asset pack:
// lang_en.png is the illuminated gold frame for the ON (active/selected) option
// lang_ar.png is the dark frame for the OFF (inactive/unselected) option
const LANG_ON_BG = '/elements/lang_en.png';
const LANG_OFF_BG = '/elements/lang_ar.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { state, setLanguage } = useBooth();
  const { language } = state.session;
  const isAr = language === 'ar';

  return (
    <div
      className="booth-screen"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#0a0806'
      }}
      data-testid="screen-welcome"
    >
      {/* Background */}
      <img 
        src="/elements/bg.png" 
        alt="Background"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {/* Title (El Gouna Logo) */}
        <motion.img 
          src="/elements/title.png" 
          alt="Title"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.1 }}
          style={{
            position: 'absolute',
            left: '31.2%',
            top: '6.04%',
            width: '37.4%',
            height: '10.5%',
            objectFit: 'contain'
          }}
        />

        {/* Sponsor Logo (Emirates NBD) */}
        <motion.div 
          title="Sponsor Logo"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.25 }}
          style={{
            position: 'absolute',
            left: '37.5%',
            top: '18%',
            width: '25%',
            height: '5%',
            backgroundColor: '#e6c59b',
            maskImage: 'url(/elements/compound_path.png)',
            WebkitMaskImage: 'url(/elements/compound_path.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />

        {/* Main Logo (بطل البوستر / The star of the poster) */}
        <AnimatePresence mode="wait">
          <motion.img 
            key={isAr ? 'logo-ar' : 'logo-en'}
            src={isAr ? '/elements/logo.png' : '/elements/The star of the poster.png'} 
            alt={isAr ? 'بطل البوستر' : 'The star of the poster'}
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: isAr ? '0%' : '8%',
              top: isAr ? '25%' : '24.6%',
              width: isAr ? '100%' : '84%',
              height: isAr ? '37.67%' : '30%',
              objectFit: 'contain'
            }}
          />
        </AnimatePresence>

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05, filter: 'brightness(1.15)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.3 }}
          style={{
            position: 'absolute',
            left: '19.63%',
            top: '58.98%',
            width: '60.83%',
            height: '6.67%',
            background: 'url(/elements/btn_primary.png) no-repeat center center',
            backgroundSize: '100% 100%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{
            color: '#1a1208',
            fontFamily: 'var(--font-arabic)',
            fontSize: isAr ? 'clamp(1.5rem, 4vw, 2.8rem)' : 'clamp(1.45rem, 3.8vw, 2.6rem)',
            fontWeight: 'bold',
            letterSpacing: isAr ? 'normal' : '0.02em',
            marginRight: '22px', // offset slightly because of the arrow on the right
            marginTop: '8px' // nudge text down slightly to center it visually
          }}>
            {isAr ? 'ابدأ التجربة' : 'Start Experience'}
          </span>
        </motion.button>

        {/* English Language Button */}
        <motion.button
          onClick={() => setLanguage('en')}
          whileHover={{ scale: 1.05, filter: 'brightness(1.15)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.4 }}
          style={{
            position: 'absolute',
            left: '24.81%',
            top: '68.16%',
            width: '22.12%',
            height: '4.63%',
            background: `url(${!isAr ? LANG_ON_BG : LANG_OFF_BG}) no-repeat center center`,
            backgroundSize: '100% 100%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.25s ease'
          }}
          aria-pressed={!isAr}
          aria-label="Switch to English"
        >
          <span style={{
            color: !isAr ? '#ffffff' : '#c9a227',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.85rem, 2vw, 1.25rem)',
            fontWeight: !isAr ? 'bold' : '600',
            textShadow: !isAr ? '0 0 10px rgba(255, 255, 255, 0.4)' : 'none',
            transition: 'color 0.25s ease, text-shadow 0.25s ease'
          }}>
            English
          </span>
        </motion.button>

        {/* Arabic Language Button */}
        <motion.button
          onClick={() => setLanguage('ar')}
          whileHover={{ scale: 1.05, filter: 'brightness(1.15)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.5 }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '68.16%',
            width: '22.17%',
            height: '4.79%',
            background: `url(${isAr ? LANG_ON_BG : LANG_OFF_BG}) no-repeat center center`,
            backgroundSize: '100% 100%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.25s ease'
          }}
          aria-pressed={isAr}
          aria-label="التبديل إلى العربية"
        >
          <span style={{
            color: isAr ? '#ffffff' : '#c9a227',
            fontFamily: 'var(--font-arabic)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: isAr ? 'bold' : '600',
            textShadow: isAr ? '0 0 10px rgba(255, 255, 255, 0.4)' : 'none',
            transition: 'color 0.25s ease, text-shadow 0.25s ease'
          }}>
            عربي
          </span>
        </motion.button>
      </div>
    </div>
  );
}
