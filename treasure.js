/** @param {NS} ns */
import GetAllServers from './im/servers'
export async function main(ns) {
	const servers = GetAllServers(ns);
	let arg = ns.args[0];
	if (!arg)
		arg = "c";

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		if (server == "home") continue;
		let files = ns.ls(server)
									.filter(f => f.indexOf(".js") == -1 && 
									filterHelper(arg, f));
		if (files.length > 0) {

			ns.tprint(server);
			for (let j = 0; j < files.length; j++) {
				const file = files[j];
				if (!filterHelper(arg, file))
					continue;

				ns.tprint(`     ${file}`);
			}
		}
	}
	ns.tprint("\r\nEnd program.");
}

function filterHelper(arg, file) {
	if (arg == "l" && file.indexOf(".lit") > -1)
		return true;

	if (arg == "c" && file.indexOf(".cct") > -1)
		return true;

	return false;
}


// function InjectHTML(str) {
// 	ns.tprint(document);
// 	//const list = document.getElementById("generic-react-container").querySelector("ul");
// 	//list.insertAdjacentHTML('beforeend', `<li>${str}</li>`)
// }