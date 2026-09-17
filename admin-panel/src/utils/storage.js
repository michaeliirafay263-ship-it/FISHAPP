export function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(`samakifresh_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(`samakifresh_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to storage', e);
  }
}
