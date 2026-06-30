'use client';
import { motion } from 'framer-motion';

export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'table') {
    return (
      <div style={{ width: '100%' }}>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, direction: 'alternate' }}
          style={{ height: '40px', background: 'var(--color-border)', borderRadius: '8px', marginBottom: '16px' }}
        />
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, direction: 'alternate', delay: i * 0.1 }}
            style={{ height: '60px', background: 'var(--color-border)', borderRadius: '8px', marginBottom: '8px' }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1, direction: 'alternate' }}
      style={{
        width: '100%',
        height: type === 'chart' ? '300px' : '150px',
        background: 'var(--color-border)',
        borderRadius: '16px',
        marginBottom: '24px'
      }}
    />
  );
}
