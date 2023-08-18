

import tickers from './static/symbols'

// ticker
// hostname
// organizationName

/** @param {NS} ns */
export async function main(ns) {
	let [targetTicker] = ns.args;
	let target = tickers.find(f => f.ticker == targetTicker)?.hostname;
	if (!target)
		return;
	await ns.grow(target)
}