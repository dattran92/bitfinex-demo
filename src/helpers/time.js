export const displayTime = (s) => {
  try {
    if (!s) return '';
    return new Date(s).toISOString().slice(-13, -5);
  } catch (e) {
    console.log('error', s);
    return '';
  }
}
