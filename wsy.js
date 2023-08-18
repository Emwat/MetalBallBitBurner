import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import StrRight from "./im/strRight"
import ToDollars from "./im/carat"
import FormatTime from "./im/time"
import tickers from './static/symbols'
import GetProgramLevel from "./im/files"

const Fee = 10 ** 7;
let LotsArray = [];
let LotsCostsDebugTxt = "lotsCosts.txt";
let LotsPortfolioTxt = "lotsPortfolio.txt";
const Cap = 20;
const SellRatioCeiling = 1.07;
const SellRatioFloor = 0.93;

// ticker
// hostname
// organizationName

/** @param {NS} ns */
export async function main(ns) {
	let arg0 = ns.args[0];
	if (ns.args.length == 0) {
		LotsArray = [];
		ns.tprint(`You started with ${ToDollars(getMoney(ns))} at ${new Date().toLocaleTimeString()}`)
		ns.disableLog("sleep");
		ns.disableLog("getServerMoneyAvailable");
		ns.disableLog("getHackingLevel");

		ns.write(LotsCostsDebugTxt, "[]", "w");
		// ns.write(LotsPortfolioTxt, "[]", "w");
		ns.tprint("measuring...");
		await StartRecording(ns);
		ns.tprint("commiting...");
		while (true) {
			await StartRecording(ns, true);
		}

	} else if (arg0 == "S") {
		SellThings(ns, () => true);
	} else if (arg0 == "sw") {
		SellThings(ns, SellWinners);
	} else if (arg0 == "sl") {
		SellThings(ns, SellLosers);
	} else if (arg0 == "l") {
		while (true) {
			ns.disableLog("disableLog");
			ns.disableLog("sleep");
			await PeekAtThings(ns);
			await ns.sleep(6000);
		}
	} else if (arg0 == "x") {
		ns.write(LotsPortfolioTxt, "[]", "w");
	}

}

/** @param {NS} ns */
async function StartRecording(ns, doBuy = false) {
	let i = 0;
	while (i < Cap) {
		let symbols = ns.stock.getSymbols()
			.map(sym => {
				return {
					name: sym,
					date: new Date(),
					price: ns.stock.getPrice(sym)
					// bear: ns.stock.getPurchaseCost(sym, 100, "Short"),
					// bull: ns.stock.getPurchaseCost(sym, 100, "Long"),
				}
			});
		LotsArray.push(symbols);
		if (LotsArray.length > Cap * 2) {
			LotsArray = LotsArray.slice(Math.floor(LotsArray.length / 2));
		}

		ns.write(LotsCostsDebugTxt, JSON.stringify(LotsArray), "w");
		if (doBuy) {
			SellThings(ns);
			TickTockThings(ns);
			BuyThings(ns);
		}
		if (i == 0) {
			ns.print(`${i} LotsArray.length: ${LotsArray.length}`)
		}
		await ns.sleep(6000);
		i++;
	}
}

/** @param {NS} ns */
function SellThings(ns, ratioCallback = false) {
	let portfolio = JParse(ns, LotsPortfolioTxt);
	for (let row of portfolio) {
		let currentPrice = ns.stock.getPrice(row.name);
		let ratio = currentPrice / row.price;
		// let longCost = ns.stock.getPurchaseCost(row.name, 100, "Long");
		// let shortCost = ns.stock.getPurchaseCost(row.name, 100, "Short");
		if (row.isLong === false) {
			ratio = row.price / currentPrice;
		}
		let wouldSell = ratio > SellRatioCeiling || ratio < SellRatioFloor;
		let soldShares = 0;

		if (ratioCallback)
			wouldSell = ratioCallback({ isLong: row.isLong, ratio });

		if (!wouldSell)
			continue;

		if (row.isLong) {
			soldShares = ns.stock.sellStock(row.name, row.purchasingShares)
		} else {
			soldShares = ns.stock.sellShort(row.name, row.purchasingShares)
		}
		let output = "Selling"
			+ " " + row.name.padEnd(4) + " "
			+ " " + NumLeft(soldShares, 13) + " "
			+ " " + (row.isLong ? "Stocks" : "Shorts")
			+ " " + " for " + StrLeft(row.price.toFixed(2), 13)
			+ " " + " b/c " + (row.isLong ? "bull" : "bear")
			+ " " + row.stockPriceAtPurchase.toFixed(2) + " -> " + currentPrice.toFixed(2)
			+ " " + " ratio: " + ratio.toFixed(2)
			//+ " " + (row.isLong ? row.iLotBull : row.iLotBear)
			;
		ns.tprint(output);
		portfolio = portfolio.filter(p => p.name != row.name);
	}
	ns.write(LotsPortfolioTxt, JSON.stringify(portfolio), "w");
}

/** @param {NS} ns */
function TickTockThings(ns) {
	let portfolio = JParse(ns, LotsPortfolioTxt);
	let homeServer = ns.getServer("home");
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const tickRam = 1.75;
	const tockRam = 1.7;

	for (let row of portfolio) {
		let targetTicker = row.name;
		let target = tickers.find(f => f.ticker == targetTicker)?.hostname;
		let homeRam = (homeServer.maxRam - homeServer.ramUsed) / portfolio.length;

		target = ns.getServer(target);

		if (myProgramsLevel < target.numOpenPortsRequired)
			continue;
		if (myHackingLevel < target.requiredHackingSkill)
			continue;
		if (ns.ps("home").find(p => p.args.includes(targetTicker)))
			continue;

		if (row.isLong) {
			ns.exec("tick.js", "home", Math.floor(homeRam / tickRam), targetTicker);
		} else {
			ns.exec("tock.js", "home", Math.floor(homeRam / tockRam), targetTicker);
		}
	}
}

/** @param {NS} ns */
function BuyThings(ns) {
	let lotsToBuy = GetLotsToBuy(ns).sort((a, b) => GetPriority(b) - GetPriority(a));
	// ns.tprint(lotsToBuy.map(ltb => `${ltb.name}/${ltb.profit.toFixed(2)}`).slice(0, 3).join(" | "));
	let portfolio = JParse(ns, LotsPortfolioTxt);
	for (let i = 0; i < lotsToBuy.length; i++) {
		const iLot = lotsToBuy[i];
		let newRow = BuyThingsHelper(ns, iLot, portfolio, i)
		if (newRow) {
			let output = "Buying "
				+ " " + newRow.name.padEnd(4) + " "
				+ " " + NumLeft(newRow.purchasingShares, 13) + " "
				+ " " + (newRow.isLong ? "Stocks" : "Shorts")
				+ " " + " for " + StrLeft(newRow.price.toFixed(2), 13)
				+ " " + " b/c " + (newRow.isLong ? "bull" : "bear")
				//+ " " + (newRow.isLong ? newRow.iLotBull : newRow.iLotBear)
				;
			ns.tprint(output);
			portfolio.push(newRow);
		}
	}
	ns.write(LotsPortfolioTxt, JSON.stringify(portfolio), "w");

}

function BuyThingsHelper(ns, iLot, portfolio, i) {
	let dist = 3 - i;
	if (dist <= 1)
		dist = 1;
	if (portfolio.length > 2)
		dist = 1;

	let myMoney = getMoney(ns) / dist;
	let myShares = portfolio.filter(p => p.name == iLot.name).length;
	if (myShares !== 0)
		return null;

	let price = ns.stock.getPrice(iLot.name);
	let isLong = iLot.profit > 1;
	// let longCost = ns.stock.getPurchaseCost(iLot.name, 100, "Long");
	// let shortCost = ns.stock.getPurchaseCost(iLot.name, 100, "Short");
	//let isLong = iLot.bull > iLot.bear;
	//let iCost = isLong ? iLot.bull : iLot.bear;
	//let cost = isLong ? longCost : shortCost;
	let purchasingShares = Math.floor((myMoney - Fee) / price);
	let stockPriceAtPurchase = 0;
	// purchasingShares = SimpleNumber(purchasingShares);

	if (purchasingShares * price < 10 ** 7)
		return null;

	if (isLong)
		stockPriceAtPurchase = ns.stock.buyStock(iLot.name, purchasingShares);
	else
		stockPriceAtPurchase = ns.stock.buyShort(iLot.name, purchasingShares);

	if (stockPriceAtPurchase <= 0) {
		ns.tprint(`Fail.`);
	}

	let newRow = {
		name: iLot.name
		, date: new Date()
		, purchasingShares
		, isLong: isLong
		, price
		// , iLotBull: iLot.bull
		// , iLotBear: iLot.bear
		, stockPriceAtPurchase
	};
	return newRow;
}

function SimpleNumber(num) {
	let input = String(num);
	return Number((input[0] + "").padEnd(input.length, "0"))
}

function GetPriority(lotsToBuy) {
	return Math.abs(lotsToBuy.profit);
	return lotsToBuy.bull > lotsToBuy.bear ? lotsToBuy.bull : lotsToBuy.bear;
}

function GetLotsToBuy(ns) {
	function DeviationReduce(accumulator, currentValue, currentIndex, array) {
		if (currentIndex == 0)
			return 1;

		let thisDeviation = currentValue.price / array[currentIndex - 1].price;
		thisDeviation = (thisDeviation + accumulator) / 2;
		ns.tprint({ a: accumulator, cur: currentValue.price, thisDeviation });
		return thisDeviation;
	}

	return ns.stock.getSymbols()
		.map((s, i, arr) => {
			let filtered = LotsArray.flat().filter(lc => lc.name == s);
			return {
				name: s,
				profit: (filtered[filtered.length - 1].price / filtered[0].price)
				//bull: lotsCosts.filter(l => l.name == s).reduce((a, c) => a += c.bull, 0),
				//bear: lotsCosts.filter(l => l.name == s).reduce((a, c) => a += c.bear, 0)
			};
		});
}

function GetLotsToBuyB(ns) {
	// let lotsOngoing = {};

	// for (let i = 0; i < lotsCosts.length; i++) {
	// 	let iLot = lotsCosts[i];
	// 	if (!lotsOngoing[iLot.name])
	// 		lotsOngoing[iLot.name] = {
	// 			a: 0, // add
	// 			s: 0 // subtract
	// 		}
	// 	lotsOngoing[iLot.name].a += iLot.bull;
	// 	lotsOngoing[iLot.name].s += iLot.bear;
	// }


}

function getMoney(ns) {
	return ns.getServerMoneyAvailable("home");
}

/** @param {NS} ns */
function BuyThingsB(ns, myPortfolio, myLogs) {

	for (let i = 0; i < symbols.length; i++) {
		let myMoney = getMoney(ns);
		const price = ns.stock.getPrice(iSym);
		let myShares = 0;

		let newShares = Math.floor(((myMoney - Fee) * 0.98) / price);

		let doNotOwn = myShares == 0;
		let isGoodForecast = iForecast >= reqAbvForecast;
		let isBuying = newShares > 0;
		let isFeePlus = newShares * price > Fee;
		// ns.print(`doNotOwn ${doNotOwn ? 1 : 0}` +
		// 	` isGoodForecast: ${isGoodForecast ? 1 : 0}` +
		// 	` isBuying: ${isBuying ? 1 : 0}` +
		// 	` fee+:${isFeePlus ? 1 : 0}` +
		// 	` = ${doNotOwn + isGoodForecast + isBuying + isFeePlus}`
		// );

		if (doNotOwn && isGoodForecast && isBuying && isFeePlus) {
			const buyPrice = Math.ceil(ns.stock.buyStock(iSym, newShares));
			if (buyPrice > 0) {
				// Runs GROW
				// ns.exec("w1.js", "home", 1000, iSym);
				PrintActivity(ns, newShares, iSym, buyPrice, iForecast, null);
				const newRow = { iSym, myShares: newShares, buyPrice, iForecast, date: new Date() };
				myPortfolio.push(newRow);
				myLogs.push(newRow);
			}
			else {
				ns.print(`Fail Buy ${iSym}
					myMoney: ${NumLeft(myMoney, 13)}
					Assumed: ${NumLeft(newShares * price, 13)}
					newShares: ${newShares}
					price: ${price}
					`);
			}
		}
	}

	return [myPortfolio, myLogs];
}

function JParse(ns, filename) {
	let text = ns.read(filename);
	if (text == "")
		return [];
	return JSON.parse(text);
}

function PeekHelper(row, currentPrice, ratio, wouldSell) {
	let { name, date, purchasingShares, isLong, price, stockPriceAtPurchase } = row;
	return (name.padEnd(6)
		+ " " + StrRight(new Date(date).toLocaleTimeString(), 14)
		+ " " + StrLeft(String(purchasingShares), 13)
		+ " " + (isLong ? "Bull" : "Bear")
		+ " " + StrLeft(ToDollars(price), 7)
		+ " " + StrLeft(ToDollars(stockPriceAtPurchase), 7)
		+ " " + StrLeft(ratio.toFixed(2), 7)
		+ " " + StrLeft(ToDollars(currentPrice), 7)
		+ " " + (name.includes("Total") ? StrLeft(ToDollars(currentPrice), 7) : StrLeft(ToDollars(currentPrice * purchasingShares), 7))
		+ " " + wouldSell
		+ "\r\n"
	);
}

async function PeekAtThings(ns) {
	let output = "\r\n";
	let portfolio = JParse(ns, LotsPortfolioTxt);
	let totalA = {
		name: "TotalA", date: new Date(),
		purchasingShares: 0, isLong: true, price: 0, stockPriceAtPurchase: 0,
		currentPrice: 0, ratio: 1
	};
	let totalB = { ...totalA, name: "TotalB", isLong: false };
	for (let row of portfolio) {
		let currentPrice = ns.stock.getPrice(row.name);
		let ratio = currentPrice / row.price;
		if (row.isLong === false) {
			ratio = row.price / currentPrice;
		}
		let wouldSell = ratio > SellRatioCeiling;
		function PeekTotalHelper(total) {
			total.purchasingShares += row.purchasingShares;
			total.price += row.purchasingShares * row.price;
			total.currentPrice += row.purchasingShares * currentPrice;
			total.stockPriceAtPurchase += row.purchasingShares * row.stockPriceAtPurchase;
		}
		if (row.isLong) {
			PeekTotalHelper(totalA);
		} else {
			PeekTotalHelper(totalB);
		}

		// TO DO: Need to calculate shorts into total.currentPrice
		output += PeekHelper(row, currentPrice, ratio, wouldSell);
	}
	output += "\r\n"
	function PeekTotalHelper(total) {
		return PeekHelper(total, total.currentPrice, total.currentPrice / total.price, false);
	}
	output += PeekTotalHelper(totalA);
	output += PeekTotalHelper(totalB);

	output = ("\r\n" + "name".padEnd(6)
		+ " " + StrRight("date", 14)
		+ " " + StrRight("ownedShares", 13)
		+ " " + StrLeft("isL", 4)
		+ " " + StrLeft("pricTxt", 7)
		+ " " + StrLeft("s$@PTxT", 7)
		+ " " + StrLeft("ratio", 7)
		+ " " + StrLeft("pricNow", 7)
		+ " " + StrLeft("value", 7)
		+ " " + StrRight("isSelling", 7)
	) + output;
	await tailPrint(ns, output);
}

async function tailPrint(ns, output) {
	ns.tail();
	await ns.sleep(0);
	let myWindowW = 1900;
	let myWindowH = 900;
	let widthAdjustment = 1000;
	let heightAdjustment = 470; //10px per line
	let x = myWindowW - widthAdjustment;
	let y = myWindowH - heightAdjustment;
	ns.resizeTail(widthAdjustment, heightAdjustment);
	ns.moveTail(x, 0);
	ns.print(output);
}

function SellWinners({ isLong, ratio }) {
	if (ratio > 1.01)
		return true;

	return false;
}

function SellLosers({ isLong, ratio }) {
	if (ratio < 0.99)
		return true;

	return false;
}

