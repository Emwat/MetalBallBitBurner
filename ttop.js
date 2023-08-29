
import StrLeft from './im/strLeft'
import StrRight from './im/strRight'
import NumLeft from './im/numLeft'


const singles = {
	"$": "lol"
	, w: "weak.js"
	, g: "grow.js"
	, h: "hack.js"
	, a: "alph.js"
	, c: "chrg.js"
	, s: "shar.js"
}

/** @param {NS} ns */
export async function main(ns) {
	if (ns.args[0] == "help") {
		let output = "\r\n";
		myScripts.forEach((script) => {
			output += `	${script.name.padEnd(20)} ${script.mem.toFixed(1).padStart(4)} \r\n`
		});
		ns.tprint(output);
	} else {
		PrintProcesses(ns);
	}

}

/** @param {NS} ns */
function PrintProcesses(ns, host = "home") {
	const processes = ns.ps(host).sort((a, b) => {
		return a.filename.localeCompare(b.filename);
	});
	let poppers = new Set();
	let output = "\r\n";
	output += ""
		+ " " + "Script".padEnd(50)
		+ " " + "PID".padStart(10)
		+ " " + "Threads".padStart(16)
		+ " " + "RAM Usage".padStart(16)
		+ "\r\n";
	for (let i = 0; i < processes.length; i++) {
		const process = processes[i];
		// helperScripts[process.filename]?.forEach(p => {
		// 	poppers.add(p);
		// })

		output += outputFormat(process);
	}
	function outputFormat({ filename, args = "", pid = "", threads = 1, mem = "" }) {
		//let mem = myScripts.find(scr => (scr.name == process.filename));
		if (filename.includes("js") && !mem) {
			mem = ns.getScriptRam(filename) * threads;
		}
		return (""
			+ " " + StrRight(`${filename} [${Shorten(args)}]`, 50)
			+ " " + NumLeft(pid, 10)
			+ " " + NumLeft(threads, 16)
			+ " " + StrRight(mem.toFixed(1).padStart(13) + " GB", 20)
			+ "\r\n"
		);
	}

	output += Free(ns) + "\r\n";
	// let totalPoppersRam = 0;
	// poppers.forEach(p => {
	// 	output += outputFormat({ filename: p });
	// 	totalPoppersRam += ns.getScriptRam(p);
	// });
	// output += outputFormat({ filename: "Total", mem: totalPoppersRam })
	ns.tprint(output);
}

const helperScripts = {
	"blade.js": ["helperBlade.js", "helperBlackOps.js", "bskills.js"]
	, "gli.js": ["helperGang.js"]
	, "wsy.js": ["clock.js", "tick.js", "tock.js"]
}

/** @param {NS} ns */
function Free(ns) {
	let server = ns.getServer("home");
	return ("".padEnd(6)
		+ " " + StrLeft("Used " + (server.ramUsed - ns.getScriptRam("ttop.js")).toFixed(1), 5)
		+ " " + "".padStart(6)
		+ " " + StrLeft("Free " + (server.maxRam - (server.ramUsed - 3.8)).toFixed(1), 5)
		+ " " + "".padStart(6)
		+ " " + "total"
		+ " " + server.maxRam.toFixed(1)
	);
}

function Shorten(scriptArgs) {
	function haha(x) {
		if (Array.isArray(x)) {
			return `[${haha(x[0])}...]len=${x.length}`;
		}
		if (typeof x == "object") {
			return "{" + Object.keys(x).slice(0, 3).join(", ") + "}"
		}
		return x;
	}

	if (Array.isArray(scriptArgs))
		return scriptArgs.map(sa => {
			try { sa = JSON.parse(sa); } catch { }
			return haha(sa);
		});
	return scriptArgs;
}
