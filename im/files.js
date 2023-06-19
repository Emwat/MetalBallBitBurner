/** @param {NS} ns */
export default function main(ns) {
	return GetProgramLevel(ns);
}

function GetProgramLevel(ns) {
	const programs = [
		"BruteSSH.exe",
		"FTPCrack.exe",
		"relaySMTP.exe",
		"HTTPWorm.exe",
		"SQLInject.exe"
	];

	for (var i = programs.length; i > 0; i--) {
		const program = programs[i - 1];
		if (ns.fileExists(program, "home"))
			return i;
	}
	return 0;
}