// Shared style for walking cat animation
export const catWalkStyle = {
  width: 120,
  height: 120,
  position: 'absolute',
  bottom: 0,
  left: '-160px',
  animation: 'walk 14s linear infinite',
  zIndex: 0,
};

export const walkKeyframes = `
  @keyframes walk {
    0% { left: -160px; }
    100% { left: 100%; }
  }
`;
