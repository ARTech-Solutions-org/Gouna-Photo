// El Gouna Film Festival Photo Booth — App Root

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoothProvider, useBooth } from './context/BoothContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { PosterSelectionScreen } from './screens/PosterSelectionScreen';
import { PosterConfirmScreen } from './screens/PosterConfirmScreen';
import { CameraScreen } from './screens/CameraScreen';
import { GeneratingScreen } from './screens/GeneratingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { EditScreen } from './screens/EditScreen';
import { QRScreen } from './screens/QRScreen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DownloadPage } from './pages/DownloadPage';

// Page transition wrappers
function PageTransition({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </motion.div>
  );
}

function BoothController() {
  const { state, setStep, resetSession } = useBooth();
  const { step } = state;

  return (
    <div className="booth-shell">
      <div className="booth-stage">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <PageTransition stepKey="welcome">
              <WelcomeScreen onStart={() => setStep('poster-selection')} />
            </PageTransition>
          )}

          {step === 'poster-selection' && (
            <PageTransition stepKey="poster-selection">
              <PosterSelectionScreen
                onBack={() => setStep('welcome')}
                onConfirm={() => setStep('poster-confirm')}
              />
            </PageTransition>
          )}

          {step === 'poster-confirm' && (
            <PageTransition stepKey="poster-confirm">
              <PosterConfirmScreen
                onBack={() => setStep('poster-selection')}
                onContinue={() => setStep('camera')}
              />
            </PageTransition>
          )}

          {step === 'camera' && (
            <PageTransition stepKey="camera">
              <CameraScreen
                onBack={() => setStep('poster-confirm')}
                onCaptured={() => setStep('generating')}
              />
            </PageTransition>
          )}

          {step === 'generating' && (
            <PageTransition stepKey="generating">
              <GeneratingScreen
                onComplete={() => setStep('result')}
                onError={(err) => {
                  alert(err);
                  setStep('camera');
                }}
              />
            </PageTransition>
          )}

          {step === 'result' && (
            <PageTransition stepKey="result">
              <ResultScreen
                onRegenerate={() => setStep('generating')}
                onEdit={() => setStep('edit')}
                onContinue={() => setStep('qr')}
              />
            </PageTransition>
          )}

          {step === 'edit' && (
            <PageTransition stepKey="edit">
              <EditScreen
                onSave={() => setStep('result')}
                onCancel={() => setStep('result')}
              />
            </PageTransition>
          )}

          {step === 'qr' && (
            <PageTransition stepKey="qr">
              <QRScreen
                onNewExperience={() => resetSession()}
              />
            </PageTransition>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  // Prevent context menu to avoid kiosk bypass
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <BoothProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoothController />} />
          <Route path="/photo/:id" element={<DownloadPage />} />
        </Routes>
      </BrowserRouter>
    </BoothProvider>
  );
}
