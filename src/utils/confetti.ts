import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#22d3ee', '#34d399', '#f59e0b']
  });
};
