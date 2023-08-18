
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

function PrintProcesses(ns) {
	const processes = ns.ps("home").sort((a, b) => {
		return a.filename.localeCompare(b.filename);
	});

	let output = "\r\n";
	output += ""
		+ " " + "Script".padEnd(50)
		+ " " + "PID".padStart(10)
		+ " " + "Threads".padStart(16)
		+ " " + "RAM Usage".padStart(13)
		+ "\r\n";
	for (let i = 0; i < processes.length; i++) {
		const process = processes[i];

		let mem = myScripts.find(scr => (scr.name == process.filename));
		mem = mem ? (mem.mem * process.threads).toFixed(1) : "-1";
		output += (""
			+ " " + StrRight(`${process.filename} [${Shorten(process.args)}]`, 50)
			+ " " + NumLeft(process.pid, 10)
			+ " " + NumLeft(process.threads, 16)
			+ " " + StrRight(mem.padStart(10) + " GB", 20)
			+ "\r\n"
		);

	}

	output += Free(ns);
	ns.tprint(output);

}

/** @param {NS} ns */
function Free(ns) {
	let server = ns.getServer("home");
	return ("".padEnd(6)
		+ " " + StrLeft("Used " + (server.ramUsed - 3.8).toFixed(1), 5)
		+ " " + "".padStart(6)
		+ " " + StrLeft("Free " +(server.maxRam - (server.ramUsed - 3.8)).toFixed(1), 5)
		+ " " + "".padStart(6)
		+ " " + "total"
		+ " " + server.maxRam.toFixed(1)
	);
}

function Shorten(scriptArgs) {
	function haha(x) {
		if (Array.isArray(x)) {
			return `[${haha(x[0])}...]`;
		}
		if (typeof x == "object") {
			return "{" + Object.keys(x).slice(0, 3).join(", ") + "}"
		}
		return x;
	}

	return scriptArgs.map(sa => {
		try { sa = JSON.parse(sa); } catch { }
		return haha(sa);
	});
}

const myScripts = [
	{ mem: 27.90, name: "blade.js" }
	, { mem: 5.60, name: "gabp.js" }
	, { mem: 5.60, name: "gabr.js" }
	, { mem: 5.70, name: "net.js" }
	, { mem: 6.30, name: "nnet.js" }
	, { mem: 5.90, name: "off.js" }
	, { mem: 8.50, name: "purchase.js" }
	, { mem: 12.8, name: "sg.js" }
	, { mem: 1.75, name: "weak.js" }
	, { mem: 1.75, name: "grow.js" }
	, { mem: 1.70, name: "hack.js" }
	, { mem: 2.20, name: "alph.js" }
	, { mem: 2.00, name: "chrg.js" }
	, { mem: 4.00, name: "shar.js" }
	, { mem: 1.80, name: "ttop.js" }
]
