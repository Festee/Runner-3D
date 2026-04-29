const TOTAL_COINS_STORAGE_KEY = 'runner3d_total_coins';

export function loadTotalCoins() {
  const storedValue = localStorage.getItem(TOTAL_COINS_STORAGE_KEY);
  const parsedValue = Number(storedValue);

  if (Number.isFinite(parsedValue) && parsedValue >= 0) {
    return parsedValue;
  }

  return 0;
}

export function saveTotalCoins(totalCoins) {
  localStorage.setItem(TOTAL_COINS_STORAGE_KEY, String(totalCoins));
}