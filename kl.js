/** @param {NS} ns */
export async function main(ns) {
	const arg0 = ns.args[0];
	if (arg0 == "servers") {
		const servers = ns.args[1].split(",");
		for (let server of servers) {
			if (ns.killall(server)) {
				ns.tprint(`killed scripts on ${server}`);
			}

		}
	}
	else if (ns.args.includes("others")) {
		KillAllOtherScripts(ns, arg0);
	}
	else {
		if (ns.scriptKill(arg0 + ".js", "home"))
			ns.tprint(`killed ${arg0}.js`);
		else
			ns.tprint(`could not kill ${arg0}.js`);
	}

}

function KillAllOtherScripts(ns, arg0) {
	let scripts = ns.ps("home");

	let foundOriginalScript = false;
	for (let i = 0; i < scripts.length; i++) {
		let script = scripts[scripts.length - 1 - i];

		if (!script)
			continue;

		if (script.filename != arg0 + ".js")
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