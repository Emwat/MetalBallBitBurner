import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import ToDollars from "./im/carat"
import FormatTime from "./im/time"

const portfolioTxt = "portfolio.txt";
const profitsTxt = "profits.txt";

/** @param {NS} ns */
export async function main(ns) {
	SeeLogs(ns);
}

function SeeLogs(ns) {
	let logs = ns.read(profitsTxt);
	if (logs.length < 3) {
		ns.tprint("You have no logs.");
		return;
	}

	logs = JSON.parse(logs);
	let totals = [];
	let output = 0;
	let grossOutput = 0;
	let myPortfolio = JSON.parse(ns.read(portfolioTxt));

	for (let i = 0; i < logs.length; i++) {
		let log = logs[i];
		let foundItem = totals.filter(f => f.iSym == log.iSym);
		if (foundItem)
			foundItem = foundItem[0];

		if (log.sellPrice) {
			if (!foundItem) {
				continue;
			} else {
				foundItem.amount += log.sellPrice * log.myShares;
			}
		}
		if (log.buyPrice) {
			let addMe = (log.buyPrice * log.myShares) * -1;
			if (!foundItem) {
				let total = { iSym: log.iSym, amount: addMe };
				totals.push(total);
			} else {
				foundItem.amount += addMe;
			}
		}
	}

	const a = 11; // main spacing
	const b = 5; // percent spacing

	ns.tprint("Symbol",
		StrLeft("Shares", a),
		StrLeft("Portfolio", a),
		StrLeft("Vola", 4),
		StrLeft("Fore", 4),
		StrLeft("Profit", a),
		StrLeft("", b),
		StrLeft("Ongoing", a),
		StrLeft("Time Bought", a),
		""
	);

	for (let i = 0; i < totals.length; i++) {
		let total = totals[i];
		let gross = myPortfolio.filter(f => f.iSym == total.iSym);
		let myShares = 0;
		let timeBought = 0;
		let grossBuyPrice = 0;
		output += total.amount;

		if (gross.length == 0) {
			gross = "";
		} else {
			gross = gross[0];
			myShares = gross.myShares;
			timeBought = gross.date;
			timeBought = new Date() - new Date(timeBought);
			timeBought = Math.floor(timeBought / 1000);
			timeBought = FormatTime(timeBought);
			timeBought = timeBought.replace("0 days ", "")
			if (gross.buyPrice)
				grossBuyPrice = gross.myShares * gross.buyPrice;
			gross = gross.myShares * ns.stock.getPrice(gross.iSym);
			grossOutput += gross;
		}


		ns.tprint(" " +
			StrLeft(total.iSym, 5), // Symbol
			myShares ? NumLeft(myShares, a) : StrLeft("", a), // Shares
			StrLeft(ToDollars(total.amount), a), // Portfolio
			myShares ? NumLeft(Math.floor(ns.stock.getVolatility(total.iSym) * 1000), 4) : StrLeft("", 4), // Vola
			myShares ? NumLeft(Math.floor(ns.stock.getForecast(total.iSym) * 100), 4) : StrLeft("", 4), // Forecast
			gross ? StrLeft(ToDollars(gross), a) : StrLeft("", a), // Profit
			grossBuyPrice ? NumLeft(gross / grossBuyPrice * 100 - 100, b - 1) + "%" : StrLeft("", b), // Profit %
			StrLeft(ToDollars(total.amount + gross), a), // Balance
			//gross ? StrLeft(FormatTime(new Date() - timeBought), a) : "", // Time
			StrLeft(gross ? timeBought : "", a), // Time
			""
		);
	}
	ns.tprint("Total:",
		StrLeft("", a),
		StrLeft(ToDollars(output), a),
		StrLeft("", 4),
		StrLeft("", 4),
		StrLeft(ToDollars(grossOutput), a),
		StrLeft("", b),
		StrLeft(ToDollars(output + grossOutput), a),
		""
	);

}