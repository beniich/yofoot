export const isRaptorMiniEnabled = (() => {
  const v = process.env.NEXT_PUBLIC_RAPTOR_MINI;
  if (!v) return false;
  return v === '1' || v.toLowerCase() === 'true';
})();

export default isRaptorMiniEnabled;
