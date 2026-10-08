
import { motion } from 'framer-motion';


const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
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

        {/* SVG filter to turn the bank logo into #e6c59a */}
        <svg style={{ width: 0, height: 0, position: 'absolute' }}>
          <filter id="gold-filter">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.902   0 0 0 0 0.773   0 0 0 0 0.604   0 0 0 1 0"
            />
          </filter>
        </svg>

        {/* Sponsor Logo (Emirates NBD) */}
        <motion.img 
          src="/elements/compound_path.png" 
          alt="Sponsor Logo"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.25 }}
          style={{
            position: 'absolute',
            left: '37.5%',
            top: '18%',
            width: '25%',
            height: '5%',
            objectFit: 'contain',
            filter: 'url(#gold-filter)'
          }}
        />

        {/* Main Logo (بطل البوستر) */}
        <motion.img 
          src="/elements/logo.png" 
          alt="Logo"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.2 }}
          style={{
            position: 'absolute',
            left: '0%',
            top: '25%',
            width: '100%',
            height: '37.67%',
            objectFit: 'contain'
          }}
        />

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
            fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
            fontWeight: 'bold',
            marginRight: '20px', // offset slightly because of the arrow on the right
            marginTop: '8px' // nudge text down slightly to center it visually
          }}>
            ابدأ التجربة
          </span>
        </motion.button>

        {/* English Language Button (Off State in design) */}
        <motion.button
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
            background: 'url(/elements/lang_en.png) no-repeat center center',
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
            color: '#c9a227', // Gold color for inactive/off state
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
            fontWeight: '600'
          }}>
            English
          </span>
        </motion.button>

        {/* Arabic Language Button (On State in design) */}
        <motion.button
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
            background: 'url(/elements/lang_ar.png) no-repeat center center',
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
            color: '#ffffff', // White color for active/on state
            fontFamily: 'var(--font-arabic)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 'bold'
          }}>
            عربي
          </span>
        </motion.button>
      </div>
    </div>
  );
}
