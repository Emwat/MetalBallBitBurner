import servers from "./static/servers"

const alias = {
	a: "alph"
	, h: "hack"
	, w: "weak"
	, g: "grow"
	, s: "shar"
	, c: "chrg"
	, bb: "blade"
	, n: "net"
	, nn: "nnet"
	, sm: "wse"
	, y: "wsy"
}


/** @param {NS} ns */
export async function main(ns) {
	let arg0 = ns.args[0];
	if (alias[arg0]) {
		arg0 = alias[arg0];
	}
	if (ns.args.length == 0) {
		ns.tprint(`
			all >> kills all scripts except home
			servers [ARRAY] >> ARRAY is comma delimited servers. Kills scripts hosted on those servers.
			others/old [SCRIPT] >> kills all SCRIPT files, except for the newest SCRIPT file
			[a/h/w/g etc.] >> kills SCRIPT on home. Refer to alias variable.
		`);
	}
	else if (arg0 == "servers") {
		if (ns.args.length == 1) {
			ns.tprint(`kl servers needs a second argument.`)
		}
		const servers = ns.args[1].split(",");
		for (let server of servers) {
			if (ns.killall(server)) {
				ns.tprint(`killed scripts on ${server}`);
			}

		}
	}
	else if (arg0 == "all") {
		for (let server of servers.filter(s => s != "home"))
			ns.killall(server);
	}
	else if (ns.args.includes("others") || ns.args.includes("old")) {
		KillAllOtherScripts(ns, arg0);
	}
	else {
		if (ns.scriptKill(arg0 + ".js", "home"))
			ns.tprint(`killed ${arg0}.js`);
		else
			ns.tprint(`could not kill ${arg0}.js`);
	}

}

function KillAllOtherScripts(ns, scriptName) {
	let scripts = ns.ps("home");

	let foundOriginalScript = false;
	for (let i = 0; i < scripts.length; i++) {
		let script = scripts[scripts.length - 1 - i];

		if (!script)
			continue;

		if (script.filename != scriptName + ".js")
			continue;

		if (foundOriginalScript == false) {
			foundOriginalScript = true;
			continue;
		}

		if (ns.kill(script.pid))
			ns.tprint(`killed ${script.filename} ${script.pid}`)
		else
			ns.tprint(`could not kill ${script.filename} ${script.pid}`)
	}
}

// kl servers "n00dles,foodnstuff,sigma-cosmetics,harakiri-sushi,hong-fang-tea,joesguns,max-hardware,nectar-net,phantasy,neo-net,zer0,iron-gym,silver-helix,omega-net,the-hub,powerhouse-fitness,titan-labs,b-and-a,netlink,vitalife"