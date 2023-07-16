/** @param {NS} ns */
import tickers from './static/symbols'

// ticker
// hostname
// organizationName

export async function main(ns) {
	let [targetTicker] = ns.args;
	let target = tickers().find(f => f.ticker == targetTicker)?.hostname;
	if (!target)
		return;
	let i = 0;
	let cap = 10;
	while(i < cap)
	{
		await ns.grow(target)
		i++;
	}

}