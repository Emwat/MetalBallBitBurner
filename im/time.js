import ZeroLeft from 'im/zeroLeft'

/** @param {NS} ns */
export default function formatTime(seconds, formatString) {
	const d = Math.floor(seconds / 86400);
	const h = Math.floor((seconds % 86400) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.round(seconds % 60);

	if (!formatString)
		return d + " days " + [
			h,
			ZeroLeft(m, 2),
			ZeroLeft(s, 2)
			// m > 9 ? m : (h ? '0' + m : m || '0'),
			// s > 9 ? s : '0' + s
		].join(':');

	return formatString
		.replace("d", d)
		.replace("hh", ZeroLeft(h, 2))
		.replace("h", h)
		.replace("m", ZeroLeft(m, 2))
		.replace("s", ZeroLeft(s, 2))
}