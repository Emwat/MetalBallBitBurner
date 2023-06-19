/** @param {NS} ns */
export default function main(ns) {
	return Helper(ns);
	//return SavedDataABC();
}

function Helper(ns) {
	var servers = ns.scan("home");

	for (var i = 0; i < servers.length; i++) {
		var server = servers[i];
		var moreServers = ns.scan(server);
		//ns.tprint(server);
		for (var j = 0; j < moreServers.length; j++) {
			var thisJServer = moreServers[j];
			if (servers.indexOf(thisJServer) < 0) {
				servers.push(thisJServer);
				//ns.tprint(thisJServer);
			}
		}
	}

	return servers;
}

function SavedData() {
	return [
		"n00dles"
		, "foodnstuff"
		, "sigma-cosmetics"
		, "joesguns"
		, "hong-fang-tea"
		, "harakiri-sushi"
		, "iron-gym"
		, "darkweb"
		, "max-hardware"
		, "nectar-net"
		, "CSEC"
		, "zer0"
		, "phantasy"
		, "omega-net"
		, "neo-net"
		, "silver-helix"
		, "the-hub"
		, "computek"
		, "johnson-ortho"
		, "crush-fitness"
		, "netlink"
		, "avmnite-02h"
		, "syscore"
		, "rothman-uni"
		, "catalyst"
		, "I.I.I.I"
		, "summit-uni"
		, "zb-institute"
		, "lexo-corp"
		, "rho-construction"
		, "aevum-police"
		, "alpha-ent"
		, "millenium-fitness"
		, "aerocorp"
		, "snap-fitness"
		, "galactic-cyber"
		, "global-pharm"
		, "deltaone"
		, "unitalife"
		, "omnia"
		, "solaris"
		, "zeus-med"
		, "defcomm"
		, "icarus"
		, "univ-energy"
		, "zb-def"
		, "nova-med"
		, "infocomm"
		, "taiyang-digital"
		, "microdyne"
		, "applied-energetics"
		, "run4theh111z"
		, "titan-labs"
		, "helios"
		, "vitalife"
		, "fulcrumtech"
		, "stormtech"
		, "omnitek"
		, "4sigma"
		, "kuai-gong"
		, "."
		, "b-and-a"
		, "nwo"
		, "clarkinc"
		, "blade"
		, "powerhouse-fitness"
		, "ecorp"
		, "fulcrumassets"
		, "The-Cave"
		, "megacorp"
	];
}

function SavedDataABC() {
	return [
		"."
		, "4sigma"
		, "aerocorp"
		, "aevum-police"
		, "alpha-ent"
		, "applied-energetics"
		, "avmnite-02h"
		, "b-and-a"
		, "blade"
		, "catalyst"
		, "clarkinc"
		, "computek"
		, "crush-fitness"
		, "CSEC"
		, "darkweb"
		, "defcomm"
		, "deltaone"
		, "ecorp"
		, "foodnstuff"
		, "fulcrumassets"
		, "fulcrumtech"
		, "galactic-cyber"
		, "global-pharm"
		, "harakiri-sushi"
		, "helios"
		, "hong-fang-tea"
		, "I.I.I.I"
		, "icarus"
		, "infocomm"
		, "iron-gym"
		, "joesguns"
		, "johnson-ortho"
		, "kuai-gong"
		, "lexo-corp"
		, "max-hardware"
		, "megacorp"
		, "microdyne"
		, "millenium-fitness"
		, "nectar-net"
		, "neo-net"
		, "netlink"
		, "nova-med"
		, "nwo"
		, "omega-net"
		, "omnia"
		, "omnitek"
		, "phantasy"
		, "powerhouse-fitness"
		, "rho-construction"
		, "rothman-uni"
		, "run4theh111z"
		, "sigma-cosmetics"
		, "silver-helix"
		, "snap-fitness"
		, "solaris"
		, "stormtech"
		, "summit-uni"
		, "syscore"
		, "taiyang-digital"
		, "The-Cave"
		, "the-hub"
		, "titan-labs"
		, "unitalife"
		, "univ-energy"
		, "vitalife"
		, "zb-def"
		, "zb-institute"
		, "zer0"
		, "zeus-med"
	];
}