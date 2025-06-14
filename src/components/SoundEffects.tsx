
import { useEffect } from 'react';

const SoundEffects = () => {
  useEffect(() => {
    // Create audio context for sound effects
    let audioContext: AudioContext | null = null;

    const initAudio = () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    const playClickSound = () => {
      initAudio();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    const playHoverSound = () => {
      initAudio();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    };

    const playSuccessSound = () => {
      initAudio();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    // Add event listeners for sound effects
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        playClickSound();
      }
    };

    const handleHover = (e: Event) => {
      const target = e.target as HTMLElement;
      // Only play hover sound for actual buttons, not navigation links or other elements
      if ((target.tagName === 'BUTTON' || (target.closest && target.closest('button'))) && 
          !target.closest('nav') && 
          !target.closest('[role="menuitem"]') &&
          !target.closest('a')) {
        playHoverSound();
      }
    };

    // Add global event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', handleHover, true);

    // Listen for success events
    window.addEventListener('success-sound', playSuccessSound);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseenter', handleHover, true);
      window.removeEventListener('success-sound', playSuccessSound);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return null;
};

export default SoundEffects;
