/** @param {NS} ns */
export async function main(ns) {
	let sinArgs = ns.args.slice(1);
	let folder = "/qsin/";
	let arg0 = ns.args[0];
	let home = "home";
	if (false) { }
	else if (["c", "crime"].includes(arg0)) {
		ns.exec(folder + "commitCrime.js", home, 1, ...sinArgs);
	} else if (["d", "tor"].includes(arg0)) {
		ns.exec(folder + "purchaseTor.js", home, 1, ...sinArgs);
	} else if (["r", "travel"].includes(arg0)) {
		const cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];
		let city = cities.find(f => f.toLowerCase()[0] == sinArgs[0]);
		ns.exec(folder + "travelToCity.js", home, 1, city);
	}

	ns.exec(folder + arg0 + ".js", home, 1, ...sinArgs);
}

// applyToCompany(companyName, field) 	Apply for a job at a company.
// b1tflum3(nextBN, callbackScript) 	b1t_flum3 into a different BN.
// checkFactionInvitations() 	List all current faction invitations.
// commitCrime(crime, focus) 	Commit a crime.
// connect(hostname) 	Connect to a server.
// createProgram(program, focus) 	Create a program.
// destroyW0r1dD43m0n(nextBN, callbackScript) 	Destroy the w0r1d_d43m0n and move on to the next BN.
// donateToFaction(faction, amount) 	Donate to a faction.
// exportGame() 	Backup game save.
// exportGameBonus() 	Returns Backup save bonus availability.
// getAugmentationBasePrice(augName) 	Get base price of an augmentation.
// getAugmentationPrereq(augName) 	Get the pre-requisite of an augmentation.
// getAugmentationPrice(augName) 	Get price of an augmentation.
// getAugmentationRepReq(augName) 	Get reputation requirement of an augmentation.
// getAugmentationsFromFaction(faction) 	Get a list of augmentation available from a faction.
// getAugmentationStats(name) 	Get the stats of an augmentation.
// getCompanyFavor(companyName) 	Get company favor.
// getCompanyFavorGain(companyName) 	Get company favor gain.
// getCompanyPositionInfo(companyName, positionName) 	Get Requirements for Company Position.
// getCompanyPositions(companyName) 	Get List of Company Positions.
// getCompanyRep(companyName) 	Get company reputation.
// getCrimeChance(crime) 	Get chance to successfully commit a crime.
// getCrimeStats(crime) 	Get stats related to a crime.
// getCurrentServer() 	Get the current server.
// getCurrentWork() 	Get the current work the player is doing.
// getDarkwebProgramCost(programName) 	Check the price of an exploit on the dark web
// getDarkwebPrograms() 	Get a list of programs offered on the dark web.
// getFactionFavor(faction) 	Get faction favor.
// getFactionFavorGain(faction) 	Get faction favor gain.
// getFactionRep(faction) 	Get faction reputation.
// getOwnedAugmentations(purchased) 	Get a list of owned augmentation.
// getOwnedSourceFiles() 	Get a list of acquired Source-Files.
// getUpgradeHomeCoresCost() 	Get the price of upgrading home cores.
// getUpgradeHomeRamCost() 	Get the price of upgrading home RAM.
// goToLocation(locationName) 	Go to a location.
// gymWorkout(gymName, stat, focus) 	Workout at the gym.
// hospitalize() 	Hospitalize the player.
// installAugmentations(cbScript) 	Install your purchased augmentations.
// installBackdoor() 	Run the backdoor command in the terminal.
// isBusy() 	Check if the player is busy.
// isFocused() 	Check if the player is focused.
// joinFaction(faction) 	Join a faction.
// manualHack() 	Run the hack command in the terminal.
// purchaseAugmentation(faction, augmentation) 	Purchase an augmentation
// purchaseProgram(programName) 	Purchase a program from the dark web.
// purchaseTor() 	Purchase the TOR router.
// quitJob(companyName) 	Quit jobs by company.
// setFocus(focus) 	Set the players focus.
// softReset(cbScript) 	Soft reset the game.
// stopAction() 	Stop the current action.
// travelToCity(city) 	Travel to another city.
// universityCourse(universityName, courseName, focus) 	Take university class.
// upgradeHomeCores() 	Upgrade home computer cores.
// upgradeHomeRam() 	Upgrade home computer RAM.
// workForCompany(companyName, focus) 	Work for a company.
// workForFaction(faction, workType, focus) 	Work for a faction.