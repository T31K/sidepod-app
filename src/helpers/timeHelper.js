export const formatSecondsToMinutes = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Ensure that the seconds part always has two digits
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${minutes}:${paddedSeconds}`;
};

export function debounce(func, delay) {
  let timeoutId;
  let cancel = function () {
    clearTimeout(timeoutId);
  };
  let debounced = function (...args) {
    cancel();
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
  debounced.cancel = cancel;
  return debounced;
}
