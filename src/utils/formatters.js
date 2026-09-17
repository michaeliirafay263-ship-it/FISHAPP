export function formatTZS(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return 'TZS 0';
  return `TZS ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatWeight(kg) {
  if (typeof kg !== 'number' || isNaN(kg)) return '0 kg';
  if (kg < 1) {
    return `${Math.round(kg * 1000)} g`;
  }
  return `${kg.toFixed(1).replace(/\.0$/, '')} kg`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
