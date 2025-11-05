import { useEffect, useState } from 'react';
import InfinityShape from './infinity-shape';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface StickyParticlesBackgroundProps {
  className?: string;
}

const sectionConfigs = {
  hero: {
    opacity: 1.2,
    cinematicPhase: 'climax',
    scale: 2.5, // increased from 1.0
    rotation: 0,
    color: 'white',
    shape: 'infinity',
    morphProgress: 0
  },
  'brand-activation': {
    opacity: 1.2,
    cinematicPhase: 'climax',
    scale: 3.0, // increased from 1.3
    rotation: 0,
    color: 'white',
    shape: 'ring',
    morphProgress: 1
  },
  products: {
    opacity: 0.8,
    cinematicPhase: 'content',
    scale: 0.9,
    rotation: -10,
    color: 'white',
    shape: 'infinity',
    morphProgress: 0
  },
  'meet-talia': {
    opacity: 1.0,
    cinematicPhase: 'particles',
    scale: 1.2,
    rotation: 30,
    color: 'blue',
    shape: 'infinity',
    morphProgress: 0
  },
  'beyond-booths': {
    opacity: 0.7,
    cinematicPhase: 'transition',
    scale: 0.8,
    rotation: -20,
    color: 'white',
    shape: 'infinity',
    morphProgress: 0
  },
  stats: {
    opacity: 1.1,
    cinematicPhase: 'climax',
    scale: 1.0,
    rotation: 45,
    color: 'purple',
    shape: 'infinity',
    morphProgress: 0
  },
  cta: {
    opacity: 0.6,
    cinematicPhase: 'content',
    scale: 0.9,
    rotation: 0,
    color: 'white',
    shape: 'infinity',
    morphProgress: 0
  },
  analytics: {
    opacity: 0.9,
    cinematicPhase: 'buildup',
    scale: 1.1,
    rotation: -30,
    color: 'blue',
    shape: 'infinity',
    morphProgress: 0
  },
  clients: {
    opacity: 0.5,
    cinematicPhase: 'transition',
    scale: 0.7,
    rotation: 15,
    color: 'white',
    shape: 'infinity',
    morphProgress: 0
  },
  footer: {
    opacity: 0.4,
    cinematicPhase: 'content',
    scale: 0.6,
    rotation: 0,
    color: 'purple',
    shape: 'infinity',
    morphProgress: 0
  }
};

export default function StickyParticlesBackground({ className }: StickyParticlesBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  const [currentSection, setCurrentSection] = useState('hero');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.3
    };
    const sections = document.querySelectorAll('[data-section]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId && sectionConfigs[sectionId]) {
            setCurrentSection(sectionId);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const currConfig = sectionConfigs[currentSection] || sectionConfigs.hero;

  return (
    <div 
      className={`relative w-full h-screen pointer-events-none ${className}`}
      style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
    >
      <div
        className='absolute inset-0'
        style={{
          opacity: currConfig.opacity,
          scale: currConfig.scale,
          rotateZ: currConfig.rotation,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          zIndex: -1,
        }}
      >
        <InfinityShape
          morphProgress={0}
          shapeFrom={currConfig.shape || 'infinity'}
          shapeTo={currConfig.shape || 'infinity'}
        />
      </div>
    </div>
  );
}