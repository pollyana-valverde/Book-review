function getCollectionHash(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return hash;
}

function getCollectionBadgeColor(seed: string) {
  const hue = getCollectionHash(seed) % 360;

  return {
    backgroundColor: `hsl(${hue} 100% 96%)`,
    borderColor: `hsl(${hue} 60% 85%)`,
    color: `hsl(${hue} 100% 30%)`,
  };
}

export { getCollectionBadgeColor };
