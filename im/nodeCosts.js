/** @param {NS} ns */



export default function main(ns) {
	// return costs;
	return GetMostAffordableNode(ns);
}

function GetMostAffordableNode(ns) {
	const myMoney = ns.getServerMoneyAvailable("home");
	for (let i = 0; i < costs.length; i++) {
		if (myMoney < costs[i])
			return i > 1 ? i - 1 : i;
	}
}

const costs = [
	1020
	, 1887
	, 3491
	, 6468
	, 11947
	, 22103
	, 40890
	, 75646
	, 139945
	, 258899
	, 478963
	, 886081
	, 1639000 // 1.639m
	, 3033000
	, 5610000
	, 10379000 // 10.379m
	, 19201000
	, 35523000
	, 65717000
	, 121576000 // 121.576m
	, 224915000
	, 416093000
	, 769772000
	, 1424000000 // 1.424b
	, 2635000000
	, 4874000000
	, 9017000000
	, 16681000000 // 16.681b
];