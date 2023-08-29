/** @param {NS} ns */
export default function ShtStr(str, max) {
	if (!str)
		return "";
	if (str.length < max)
		return str;
	let half = Math.floor(max / 2);
	return `${str.slice(0, half)}...${str.slice(str.length - half)}`
}
