import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface BoothButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary'; // We can ignore variant and just use the same bg for now
}

function hasEnglishText(node: React.ReactNode): boolean {
  if (typeof node === 'string') return /[a-zA-Z]/.test(node);
  if (typeof node === 'number') return false;
  if (Array.isArray(node)) return node.some(hasEnglishText);
  if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
    return hasEnglishText((node.props as { children?: React.ReactNode }).children);
  }
  return false;
}

export function BoothButton({ children, style, className = '', ...props }: BoothButtonProps) {
  const isGhostOrTab = className.includes('btn-ghost') || className.includes('category-tab') || className.includes('lang-btn');
  const isEnglish = hasEnglishText(children);

  return (
    <motion.button
      className={className}
      whileHover={{ scale: isGhostOrTab ? 1.02 : 1.05, filter: 'brightness(1.1)' }}
      whileTap={{ scale: isGhostOrTab ? 0.98 : 0.95 }}
      style={{
        ...style,
        ...(isGhostOrTab ? {} : {
          background: `url('/elements/btn_primary.png') no-repeat center center`,
          backgroundSize: '100% 100%',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#1a1208',
          fontFamily: isEnglish ? 'var(--font-body)' : 'var(--font-arabic)',
          fontSize: isEnglish ? '0.95rem' : '1.5rem',
          fontWeight: isEnglish ? 700 : 'bold',
          letterSpacing: isEnglish ? '0.04em' : 'normal',
          textTransform: isEnglish ? 'uppercase' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '657 / 128',
          width: '100%',
          maxWidth: '350px',
          margin: '0 auto',
          paddingRight: '15px', // offset for the arrow icon
          textShadow: 'none',
        }),
        cursor: 'pointer',
        boxShadow: 'none',
        outline: 'none',
        transition: 'filter 0.3s ease',
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
