/** @param {NS} ns */
import ZeroLeft from 'im/zeroLeft'

export default function formatTime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return d + " days " + [
    h,
		ZeroLeft(m,2),
		ZeroLeft(s,2)
    // m > 9 ? m : (h ? '0' + m : m || '0'),
    // s > 9 ? s : '0' + s
  ].join(':');
}