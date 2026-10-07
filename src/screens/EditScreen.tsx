// El Gouna Film Festival Photo Booth — Edit Photo Screen

import { useRef, useEffect, useMemo } from 'react';
import { BoothButton } from '../components/BoothButton';
import { motion } from 'framer-motion';
import { useBooth } from '../context/BoothContext';
import type { FilterType } from '../types';

const spring = { type: 'spring' as const, damping: 28, stiffness: 120 };

const FILTERS: { id: FilterType; labelAr: string; labelEn: string; css: string }[] = [
  { id: 'original', labelAr: 'أصلي', labelEn: 'Original', css: 'none' },
  { id: 'warm', labelAr: 'دافئ', labelEn: 'Warm', css: 'sepia(0.4) saturate(1.3) brightness(1.05) hue-rotate(-10deg)' },
  { id: 'bw', labelAr: 'أبيض وأسود', labelEn: 'B&W', css: 'grayscale(1) contrast(1.1)' },
  { id: 'cinematic', labelAr: 'سينمائي', labelEn: 'Cinematic', css: 'contrast(1.2) saturate(0.8) brightness(0.9) sepia(0.15)' },
  { id: 'bright', labelAr: 'مضيء', labelEn: 'Bright', css: 'brightness(1.2) contrast(0.95) saturate(1.1)' },
];

interface EditScreenProps {
  onSave: () => void;
  onCancel: () => void;
}

export function EditScreen({ onSave, onCancel }: EditScreenProps) {
  const { state, setFilter, setEditedImage } = useBooth();
  const { language, generatedImage, appliedFilter } = state.session;
  const isAr = language === 'ar';

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeFilter = FILTERS.find(f => f.id === appliedFilter) ?? FILTERS[0];

  // Apply filter to canvas and produce edited image data URL
  const applyFilterToCanvas = async (filter: FilterType) => {
    if (!generatedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const filterDef = FILTERS.find(f => f.id === filter)!;
      ctx.filter = filterDef.css;
      ctx.drawImage(img, 0, 0);
      const editedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setEditedImage(editedDataUrl);
    };
    img.src = generatedImage;
  };

  const handleFilterSelect = (filter: FilterType) => {
    setFilter(filter);
    applyFilterToCanvas(filter);
  };

  const handleSave = () => {
    applyFilterToCanvas(appliedFilter);
    onSave();
  };

  // Apply default on mount
  useEffect(() => {
    applyFilterToCanvas(appliedFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedImage]);

  const previewStyle = useMemo(() => ({
    filter: activeFilter.css === 'none' ? undefined : activeFilter.css,
  }), [activeFilter.css]);

  return (
    <div className="booth-screen" data-testid="screen-edit" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0806 0%, #120e08 100%)',
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
            onClick={onCancel}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            {isAr ? '✕ إلغاء' : '✕ Cancel'}
          </BoothButton>

          <h1 style={{
            fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: 'var(--c-cream)',
            fontWeight: isAr ? 700 : 600,
          }}>
            {isAr ? 'تعديل صورتك' : 'Edit Your Photo'}
          </h1>

          <BoothButton
            className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
            onClick={handleSave}
            style={{ padding: '10px 20px', fontSize: '0.85rem' }}
            data-testid="btn-save-edit"
          >
            {isAr ? 'حفظ' : 'Save'}
          </BoothButton>
        </motion.div>

        {/* Image preview */}
        <motion.div
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 0,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <div style={{
            height: '100%',
            maxHeight: '55vh',
            aspectRatio: '2 / 3',
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid rgba(201,162,39,0.4)',
            boxShadow: '0 16px 60px rgba(0,0,0,0.7)',
            transition: 'filter 0.4s ease',
          }}>
            {generatedImage && (
              <img
                src={generatedImage}
                alt={isAr ? 'معاينة' : 'Preview'}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  ...previewStyle,
                  transition: 'filter 0.4s ease',
                }}
                data-testid="edit-preview"
              />
            )}
          </div>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          style={{
            flexShrink: 0,
            display: 'flex', gap: '16px',
            justifyContent: 'center',
            overflowX: 'auto',
            padding: '8px 0',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          {FILTERS.map((f) => (
            <BoothButton
              key={f.id}
              className={`filter-pill ${appliedFilter === f.id ? 'active' : ''}`}
              onClick={() => handleFilterSelect(f.id)}
              data-testid={`filter-${f.id}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <div className="filter-pill-thumb">
                {generatedImage && (
                  <img
                    src={generatedImage}
                    alt={f.id}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      filter: f.css === 'none' ? undefined : f.css,
                    }}
                  />
                )}
              </div>
              <span className="filter-pill-label">
                {isAr ? f.labelAr : f.labelEn}
              </span>
            </BoothButton>
          ))}
        </motion.div>

        {/* Save button */}
        <motion.div
          style={{ flexShrink: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          <BoothButton
            className={`btn-cinematic btn-primary ${isAr ? 'btn-arabic' : ''}`}
            onClick={handleSave}
            style={{ width: '100%', padding: '20px' }}
          >
            {isAr ? 'حفظ التعديلات ✦' : '✦ Save Edits'}
          </BoothButton>
        </motion.div>
      </div>

      {/* Hidden canvas for actual filter application */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
