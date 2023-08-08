/** @param {NS} ns */
import Cities from './static/cities'
import StrLeft from './im/strLeft'
import StrRight from './im/strRight'
import NumLeft from './im/numLeft'

export async function main(ns) {
	let arg0 = ns.args[0];


	if (!arg0 || arg0 == "help") {
		ns.tprint(`No arguments found. Available arguments are
		c >> Cities
		cm >> cm
		`);
		return;
	} else if (arg0 == "c") {
		PrintCities(ns);
	} else if (arg0 == "cm") {
		ns.tprint(GetCityWithMinChaos(ns));
	}
}


function PrintCities(ns) {
	let output = "\r\n"
	let intel = Cities.map(m => {
		return {
			name: m,
			chaos: ns.bladeburner.getCityChaos(m),
			communities: ns.bladeburner.getCityCommunities(m),
			estimatedPopulation: ns.bladeburner.getCityEstimatedPopulation(m),
		}
	});


	let cities = intel.sort((a, b) => a.chaos - b.chaos);
	output += (StrRight("name", 10) +
			" " + StrLeft("chaos", 5) +
			" " + StrLeft("community", 10) +
			" " + StrLeft("est. Pop", 12) +
			"\r\n");
	for (const c in cities) {
		let city = cities[c];
		output += (StrRight(city.name, 10) +
			" " + NumLeft(city.chaos, 5) +
			" " + NumLeft(city.communities, 10) +
			" " + NumLeft(city.estimatedPopulation, 12) +
			"\r\n");
	}
	ns.tprint(output);
}

function GetCityWithMinChaos(ns) {
	let cities = Cities
		.sort((a, b) => ns.bladeburner.getCityChaos(a) - ns.bladeburner.getCityChaos(b));
	return cities[0];
}
