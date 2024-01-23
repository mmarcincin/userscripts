// ==UserScript==
// @name         Humble Bundle tools
// @description  Total cost, game keys export and other enhancements
// @version      0.0.3.7
// @author       https://github.com/mmarcincin/userscripts
// @namespace    https://github.com/mmarcincin/userscripts
// @include      https://www.humblebundle.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

if (window.top === window.self) {
	function addCssStyle(rule) {
		var css = document.createElement("style"); // Creates <style></style>
		css.className = "customViewStyle";
		css.type = "text/css"; // Specifies the type
		if (css.styleSheet)
			css.styleSheet.cssText = rule; // Support for IE
		else
			css.appendChild(document.createTextNode(rule)); // Support for the rest
		document.getElementsByTagName("head")[0].appendChild(css); // Specifies where to place the css
	}

	/* Total cost script content for purchases - start */
	var loadCounter1 = 0;
	var lastRun1 = 0;

	function humbleCalc() {
		loadCounter1++;
		if (document.getElementsByClassName("total").length > 0) {
			//if (document.getElementsByClassName("js-unclaimed-purchases-loading").length > 0 && document.getElementsByClassName("js-unclaimed-purchases-loading")[0].style.display === "none") {
			if (document.getElementsByClassName("js-purchase-holder js-holder")[0].getElementsByClassName("results js-results")[0].getElementsByClassName("product-name").length > 0) {
				//if (typeof(document.getElementsByClassName("total")[0]) != "undefined") {
				if (!(document.getElementById("prices"))) {
					var currencySigns = ["$"];
					var currencyValues = [0];
					do {
						var priceTable = document.getElementsByClassName("total");

						for (var i = 0; i < priceTable.length; i++) {
							var prodPrice = priceTable[i].innerHTML.trim();
							prodPrice = prodPrice.replace(",", ".");
							var regExp = /\d+\.\d+/g;
							var cValue = regExp.exec(prodPrice);

							if (typeof(cValue) !== "undefined" && cValue !== null) {
								var cSign = prodPrice.replace(cValue[0], "");
								cValue = cValue[0] / 1;
								var cSignNotFound = true;
								for (var j = 0; j < currencySigns.length; j++) {
									if (cSign == currencySigns[j]) {
										currencyValues[j] += cValue;
										cSignNotFound = false;
										break;
									}
								}
								if (cSignNotFound) {
									currencySigns.push(cSign);
									currencyValues.push(cValue);
								}
							}
						}

						if (lastRun1 == 1) {
							lastRun1 = 0;
						} else {
							if (document.getElementsByClassName("pagination").length > 0) {
								document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-right")[0].parentNode.click();
							}
							if (document.getElementsByClassName("pagination").length > 0 && !(document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-right")[0])) {
								lastRun1 = 1;
							}
						}
					} while (document.getElementsByClassName("pagination").length > 0 && document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-right")[0] || lastRun1 == 1);
					while (document.getElementsByClassName("pagination").length > 0 && document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-left")[0]) {
						document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-left")[0].parentNode.click();
					}

					var modEle1 = document.getElementsByClassName("sort")[0];
					var priceElement = document.createElement("div");
					priceElement.id = "prices";
					var totalCost = document.createElement("h1");
					var totalCostString = "Total Cost";
					//console.log(currencySigns.length);
					for (var i = 0; i < currencySigns.length; i++) {
						totalCostString += " | " + currencySigns[i] + currencyValues[i].toFixed(2);
						if ((i + 1) % 3 == 0) {
							totalCostString += "<br>";
						}
					}
					totalCost.innerHTML = totalCostString;
					priceElement.appendChild(totalCost);
					modEle1.appendChild(priceElement);
					/*
					while (document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-right")[0]) {
					document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-right")[0].parentNode.click();
					}

					while (document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-left")[0]) {
					document.getElementsByClassName("pagination")[0].getElementsByClassName("hb hb-chevron-left")[0].parentNode.click();
					}
					 */
				}
				loadCounter1 = 0;
				clearInterval(nextPageQ1);
			}
		} else {
			if (loadCounter1 > 8) {
				loadCounter1 = 0;
				console.log("Your humble purchases page took too long to load.");
				clearInterval(nextPageQ1);
			}
		}
	}
	/* Total cost script content for purchases - end */

	/* Unredeemed keys extractor - start */
	var loadCounter2 = 0;
	var lastRun2 = 0;

	function humbleGetGames() {
		loadCounter2++;
		if (document.getElementsByClassName("game-name").length > 0) {
			if (!(document.getElementById("humble-custom-gamelist"))) {
				//if (document.getElementsByClassName("keyfield redeemed").length > 0) {document.getElementById("hide-redeemed").click();}
				var gameListAll = [];
				var gameList = [];
				var gameListInfo = [];

				var x2 = document.createElement('textarea');
				x2.setAttribute("id", "humble-custom-gamelist");
				x2.setAttribute("style", "resize:none");
				x2.setAttribute("rows", "10");
				x2.setAttribute("cols", "50");
				x2.readOnly = true;
				x2.style.display = "none";

				var gameListTitle = "";
				function saveTextAsFile() {
					var textToWrite = document.getElementById('humble-custom-gamelist').value;
					var textFileAsBlob = new Blob([textToWrite], {
							type: 'text/plain'
						});
					var fileNameToSaveAs = "HB_" + gamelistTitle + "_Game_List.html";

					var downloadLink = document.createElement("a");
					downloadLink.download = fileNameToSaveAs;
					downloadLink.innerHTML = "Download File";

					downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
					downloadLink.click();
				}

				/* complete game list buttons */
				var button21 = document.createElement('button');
				button21.setAttribute('type', 'button');
				button21.setAttribute('id', 'button-copy1');
				button21.setAttribute('onclick', ';return false;');
				button21.setAttribute('title', "Copy complete keys' title list to clipboard");

				var span21 = document.createElement('span');
				span21.setAttribute('class', 'humble-uix-button-content');
				span21.innerHTML = 'Copy';
				button21.appendChild(span21);

				var button22 = document.createElement('button');
				button22.setAttribute('type', 'button');
				button22.setAttribute('id', 'button-save1');
				button22.setAttribute('onclick', ';return false;');
				button22.setAttribute('title', "Save complete keys' title list as file");

				var span22 = document.createElement('span');
				span22.setAttribute('class', 'humble-uix-button-content');
				span22.innerHTML = 'Save File';
				button22.appendChild(span22);

				/* unredeemed game list buttons */
				var button23 = document.createElement('button');
				button23.setAttribute('type', 'button');
				button23.setAttribute('id', 'button-copy2');
				button23.setAttribute('onclick', ';return false;');
				button23.setAttribute('title', "Copy unredeemed keys' title list to clipboard");

				var span23 = document.createElement('span');
				span23.setAttribute('class', 'humble-uix-button-content');
				span23.innerHTML = 'Copy';
				button23.appendChild(span23);

				var button24 = document.createElement('button');
				button24.setAttribute('type', 'button');
				button24.setAttribute('id', 'button-save2');
				button24.setAttribute('onclick', ';return false;');
				button24.setAttribute('title', "Save unredeemed keys' title list as file");

				var span24 = document.createElement('span');
				span24.setAttribute('class', 'humble-uix-button-content');
				span24.innerHTML = 'Save File';
				button24.appendChild(span24);
				/* game list (+ expiration info) buttons */
				var button25 = document.createElement('button');
				button25.setAttribute('type', 'button');
				button25.setAttribute('id', 'button-copy3');
				button25.setAttribute('onclick', ';return false;');
				button25.setAttribute('title', "Copy expiring keys' title list (+ expiration info) to clipboard");

				var span25 = document.createElement('span');
				span25.setAttribute('class', 'humble-uix-button-content');
				span25.innerHTML = 'Copy';
				button25.appendChild(span25);

				var button26 = document.createElement('button');
				button26.setAttribute('type', 'button');
				button26.setAttribute('id', 'button-save3');
				button26.setAttribute('onclick', ';return false;');
				button26.setAttribute('title', "Save expiring keys' title list (+ expiration info) as file");

				var span26 = document.createElement('span');
				span26.setAttribute('class', 'humble-uix-button-content');
				span26.innerHTML = 'Save File';
				button26.appendChild(span26);
				function getGamesList() {
					gameListAll = [];
					gameList = [];
					gameListInfo = [];
					var nextPageId2 = document.getElementsByClassName("pagination").length - 2;
					do {
						var gameTable = document.getElementsByClassName("game-name");
						for (var i = 1; i < gameTable.length; i++) {
							var bundleTitle = "";
							var gameTitle = gameTable[i].getElementsByTagName("h4")[0].innerHTML;
							if (typeof(gameTable[i].getElementsByTagName("a")[0]) !== "undefined") {
								bundleTitle = gameTable[i].getElementsByTagName("a")[0].innerHTML;
							} else {
								if (gameTitle.toLowerCase().indexOf("humble choice") !== -1) {
									bundleTitle = "Humble Choice";
								} else {
									bundleTitle = "none";
								}
							}
							var redeem1 = false;
							var redeemInfo = "";
							if (gameTable[i].parentNode.getElementsByClassName("custom-instruction").length > 0) {
								var redeemInfoTemp = gameTable[i].parentNode.getElementsByClassName("custom-instruction")[0].innerText;
								if (redeemInfoTemp.indexOf(", 20") !== -1) {
									redeem1 = true;
									if (redeemInfoTemp.indexOf("Redemption Instructions") !== -1) {
										redeemInfo = redeemInfoTemp.substring(redeemInfoTemp.indexOf("Redemption Instructions") + 23).trim();
									} else {
										if (redeemInfoTemp.indexOf("Redeem") === 0) {
											redeemInfoTemp = redeemInfoTemp.substring(redeemInfoTemp.indexOf("Redeem") + 6).trim();
										}
										redeemInfo = redeemInfoTemp.trim();
									}
								}
							} else {
								if (gameTable[i].parentNode.getElementsByClassName("expiration-messaging").length > 0) {
									redeem1 = true;
									redeemInfo = gameTable[i].parentNode.getElementsByClassName("expiration-messaging")[0].innerText.trim();
								}
							}

							if (gameTitle === bundleTitle) {
								bundleTitle = "Humble Store"
							}
							//var addString = gameTitle + " | " + bundleTitle;
							var addString = "<tr>\n<td>" + gameTitle + "</td>\n<td>" + bundleTitle + "</td>\n</tr>\n";
							var addStringAndInfo = "<tr>\n<td>" + gameTitle + "</td>\n<td>" + bundleTitle + "</td>\n<td>" + redeemInfo + "</td>\n</tr>\n";
							//("keyfield redeemed-gift").length check added, thanks to cowbutt from github
							if ((gameTable[i].parentNode.getElementsByClassName("keyfield redeemed").length === 0) && (gameTable[i].parentNode.getElementsByClassName("keyfield redeemed-gift").length === 0)) {
								gameList.push(addString);
							}
							if (redeem1) {
								gameListInfo.push(addStringAndInfo);
							}
							gameListAll.push(addString);
						}

						if (lastRun2 == 1) {
							lastRun2 = 0;
						} else {
							if (document.getElementsByClassName("pagination").length > 0) {
								document.getElementsByClassName("pagination")[nextPageId2].getElementsByClassName("hb hb-chevron-right")[0].parentNode.click();
							}
							if (document.getElementsByClassName("pagination").length > 0 && !(document.getElementsByClassName("pagination")[nextPageId2].getElementsByClassName("hb hb-chevron-right")[0])) {
								lastRun2 = 1;
							}
						}
					} while (document.getElementsByClassName("pagination").length > 0 && document.getElementsByClassName("pagination")[nextPageId2].getElementsByClassName("hb hb-chevron-right")[0] || lastRun2 == 1);
					while (document.getElementsByClassName("pagination").length > 0 && document.getElementsByClassName("pagination")[nextPageId2].getElementsByClassName("hb hb-chevron-left")[0]) {
						document.getElementsByClassName("pagination")[nextPageId2].getElementsByClassName("hb hb-chevron-left")[0].parentNode.click();
					}
					console.log("gameList length: " + gameListAll.length);
					gameList.sort();
					gameListAll.sort();
					gameListInfo.sort();
				}

				var modEle2 = document.getElementsByClassName("sort")[document.getElementsByClassName("sort").length - 1];
				modEle2.appendChild(x2);
				var buttonsElement = document.createElement("div");
				var blankSpace2 = document.createElement("span");
				blankSpace2.style.marginRight = "20px";
				buttonsElement.innerHTML += "Complete Keys' Title List: ";
				buttonsElement.appendChild(button21);
				buttonsElement.appendChild(button22);
				buttonsElement.appendChild(blankSpace2);
				buttonsElement.innerHTML += "Unredeemed Keys' Title List: ";
				buttonsElement.appendChild(button23);
				buttonsElement.appendChild(button24);
				buttonsElement.innerHTML += "\n<br><br>\nExpiring Keys' Title List (+ expiration info): ";
				buttonsElement.appendChild(button25);
				buttonsElement.appendChild(button26);

				modEle2.appendChild(buttonsElement);

				function addCompleteGameList() {
					getGamesList();
					var copyText = document.getElementById("humble-custom-gamelist");
					var tempText = "<html>\n<head>\n<style>\ntable, th, td {border: 1px solid black; border-collapse: collapse;}\nth, td {max-width: 500px; padding: 5px;}\ntd {word-wrap: break-word;}\ntr:nth-child(even) {background-color: #dddddd;}\n</style>\n</head>\n<body>\n<h2>Humble Bundle Complete Keys' Title List</h4>\n";
					tempText += "<table>\n<tr>\n<th>Product Name</th>\n<th>Bundle Name</th>\n</tr>" + "\n";
					for (var i = 0; i < gameListAll.length; i++) {
						tempText += gameListAll[i] + "\n";
					}
					tempText += "</body>\n<html>\n";
					copyText.value = tempText;
					copyText.style.display = "block";
					copyText.focus();
					copyText.select();
					document.execCommand("copy");
					copyText.style.display = "none";
				}

				function addUnredeemedGameList() {
					getGamesList();
					var copyText = document.getElementById("humble-custom-gamelist");
					var tempText = "<html>\n<head>\n<style>\ntable, th, td {border: 1px solid black; border-collapse: collapse;}\nth, td {max-width: 500px; padding: 5px;}\ntd {word-wrap: break-word;}\ntr:nth-child(even) {background-color: #dddddd;}\n</style>\n</head>\n<body>\n<h2>Humble Bundle Unredeemed Keys' Title List</h4>\n";
					tempText += "<table>\n<tr>\n<th>Product Name</th>\n<th>Bundle Name</th>\n</tr>" + "\n";
					for (var i = 0; i < gameList.length; i++) {
						tempText += gameList[i] + "\n";
					}
					tempText += "</body>\n<html>\n";
					copyText.value = tempText;

					copyText.style.display = "block";
					copyText.focus();
					copyText.select();
					document.execCommand("copy");
					copyText.style.display = "none";
				}

				function addGameListAndInfo() {
					getGamesList();
					var copyText = document.getElementById("humble-custom-gamelist");
					var tempText = "<html>\n<head>\n<style>\ntable, th, td {border: 1px solid black; border-collapse: collapse;}\nth, td {max-width: 500px; padding: 5px;}\ntd {word-wrap: break-word;}\ntr:nth-child(even) {background-color: #dddddd;}\n</style>\n</head>\n<body>\n<h2>Humble Bundle Expiring Keys' Title List (+ expiration info)</h4>\n";
					tempText += "<table>\n<tr>\n<th>Product Name</th>\n<th>Bundle Name</th>\n<th>Expiration Information</th>\n</tr>" + "\n";
					for (var i = 0; i < gameListInfo.length; i++) {
						tempText += gameListInfo[i] + "\n";
					}
					tempText += "</body>\n<html>\n";
					copyText.value = tempText;

					copyText.style.display = "block";
					copyText.focus();
					copyText.select();
					document.execCommand("copy");
					copyText.style.display = "none";
				}

				document.getElementById("button-copy1").addEventListener('click', addCompleteGameList);
				//button21.addEventListener('click', addCompleteGameList);
				document.getElementById("button-save1").addEventListener('click', function () {
					addCompleteGameList();
					gamelistTitle = "Complete";
					saveTextAsFile();
				});

				document.getElementById("button-copy2").addEventListener('click', addUnredeemedGameList);
				document.getElementById("button-save2").addEventListener('click', function () {
					addUnredeemedGameList();
					gamelistTitle = "Unredeemed";
					saveTextAsFile();
				});

				document.getElementById("button-copy3").addEventListener('click', addGameListAndInfo);
				document.getElementById("button-save3").addEventListener('click', function () {
					addGameListAndInfo();
					gamelistTitle = "Info_and";
					saveTextAsFile();
				});
			}
			loadCounter2 = 0;
			clearInterval(nextPageQ2);
		} else {
			if (loadCounter2 > 8) {
				loadCounter2 = 0;
				console.log("Your humble keys page took too long to load.");
				clearInterval(nextPageQ2);
			}
		}
	}

	/* unredeemed keys extractor - end */

	/* Humble bar modifier */

	var loadCounter3 = 0;
	var nextPageQ1;

	function enhancedBar() {
		loadCounter3++;
		if (document.getElementsByClassName("tabbar-tab").length == 4) {
			var barButtons = document.getElementsByClassName("tabbar-tab");
			for (var i = 0; i < barButtons.length; i++) {
				if (barButtons[i].href.indexOf("/home/purchases") !== -1) {
					barButtons[i].id = "purchases_button";
					barButtons[i].addEventListener('click', function () {
						nextPageQ1 = setInterval(humbleCalc, 1000);
					});
				}
				if (barButtons[i].href.indexOf("/home/keys") !== -1) {
					barButtons[i].id = "keys_button";
					barButtons[i].addEventListener('click', function () {
						nextPageQ2 = setInterval(humbleGetGames, 1000);
					});
				}
			}
			loadCounter3 = 0;
			clearInterval(nextPageQ3);
		} else {
			if (loadCounter3 > 8) {
				loadCounter3 = 0;
				console.log("Your humble home page took too long to load.");
				clearInterval(nextPageQ3);
			}
		}
	}

	if (window.location.href.indexOf("https://www.humblebundle.com/home/") === 0) {
		var nextPageQ3 = setInterval(enhancedBar, 1000);
	}

	if (window.location.href.indexOf("https://www.humblebundle.com/home/purchases") === 0) {
		var nextPageQ1 = setInterval(humbleCalc, 1000);
	} else {
		if (window.location.href.indexOf("https://www.humblebundle.com/home/keys") === 0) {
			var nextPageQ2 = setInterval(humbleGetGames, 1000);
		}
	}

	/* Humble Bundle dropdown menu additions - start */
	var pageSize = 0;
	var eleEvent = document.getElementsByClassName("js-user-item-dropdown-toggle js-navbar-dropdown js-maintain-scrollbar-on-dropdown js-user-navbar-item navbar-item navbar-item-dropdown user-navbar-item logged-in button-title no-style-button")[0];
	function addDropdownLink() {
		if (document.getElementsByClassName("js-disable-body-scroll navbar-item-dropdown-items user-items nav-dropdown-items").length > 0) {
			var appendEle = document.getElementsByClassName("js-disable-body-scroll navbar-item-dropdown-items user-items nav-dropdown-items")[0];
			/*
      var troveLink = document.createElement("span");
			troveLink.innerHTML = '<a href="/membership/collection" class="navbar-item-dropdown-item">       <i class="navbar-item-dropdown-icon hb hb-library has-perks"></i>       Humble App/Trove     </a>';
			appendEle.insertBefore(troveLink, appendEle.getElementsByClassName("navbar-item-dropdown-item")[1]);
			*/
			var billingLink = document.createElement("span");
			billingLink.innerHTML = '<a href="/user/subscriptions/humble_monthly/billing" class="navbar-item-dropdown-item">      <i class="navbar-item-dropdown-icon hb hb-money has-perks"></i>      Billing    </a>';
			appendEle.insertBefore(billingLink, appendEle.querySelector('a[href="/user/settings"]'));
			var menuLinks = appendEle.getElementsByTagName("a");
			var linkImg = document.createElement("i");
			var logoutEle = appendEle.getElementsByClassName("navbar-item-dropdown-item js-navbar-logout")[0];
			linkImg.className = "navbar-item-dropdown-icon hb hb-sign-out";
			logoutEle.insertBefore(linkImg, logoutEle.firstChild);

			for (var i = 0; i < menuLinks.length - 1; i++) {
				var linkImg = document.createElement("i");
				switch (menuLinks[i].href) {
				case "https://www.humblebundle.com/membership/home":
					linkImg.className = "navbar-item-dropdown-icon hb hb-choice has-perks";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/home/library":
					linkImg.className = "navbar-item-dropdown-icon hb hb-library";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/home/purchases":
					linkImg.className = "navbar-item-dropdown-icon hb hb-tier";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/home/keys":
					linkImg.className = "navbar-item-dropdown-icon hb hb-key";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/home/coupons":
					linkImg.className = "navbar-item-dropdown-icon hb hb-scissors";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/store/wishlist":
					linkImg.className = "navbar-item-dropdown-icon hb hb-star";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/user/wallet":
					linkImg.className = "navbar-item-dropdown-icon hb hb-money";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/refer":
					linkImg.className = "navbar-item-dropdown-icon hb hb-giftbox";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
					break;
				case "https://www.humblebundle.com/user/settings":
					linkImg.className = "navbar-item-dropdown-icon hb hb-cog";
					menuLinks[i].insertBefore(linkImg, menuLinks[i].firstChild);
				}
			}
		}
	}


	addDropdownLink();
	/* dropdown menu is created with page load and also no longer scrapped when it's opened anymore - start */
	/*
	function delayedMenuAddition() {
	if (document.getElementsByClassName("navbar-content")[0].innerHTML.length === pageSize) {
	eleEvent.addEventListener('click', addDropdownLink);
	clearInterval(delayedMenuLoop);
	console.log("Menu modified successfully");
	} else {
	pageSize = document.getElementsByClassName("navbar-content")[0].innerHTML.length;
	}

	}

	if (typeof eleEvent !== "undefined") {
	var delayedMenuLoop = setInterval(delayedMenuAddition, 400);
	}
	 */
	/* dropdown menu is created with page load and also no longer scrapped when it's opened anymore - start */

	/* Humble Bundle dropdown menu additions - end */

	/* Humble Bundle custom price increase hints - start - disabled - default one works and the source code for custom one was removed -> throws errors */
	var customPriceCounter = 0;
	function customPriceIncrease() {
		customPriceCounter++;
		if (document.getElementsByClassName("master-amount").length > 0) {
			var tiersData = window.models.product_json.monetary_content_event_data;
			var tiersInfoText = []
			var tiersInfoAmount = []
			var avgAmount = Math.round(window.models.keyentity_json.avg * 100) + 1;
			var paidAmount = window.models.keyentity_json.cleanfamilytotal.amount * 100;
			var addedAmount = document.getElementsByClassName("master-amount")[0].value * 100;
			var avgI = -1;
			var addedAvg = 0;
			for (var i = 0; i < tiersData.length; i++) {
				if (tiersData[i].type === "average") {
					avgI = i;
				}
			}
			for (var i = 0; i < tiersData.length; i++) {
				if (tiersData[i].type !== "average") {
					var tierValue = tiersData[i].amount * 100;
					if (tierValue >= avgAmount && avgI > -1) {
						tiersInfoText.push(tiersData[avgI]["warning-locked"]);
						tiersInfoAmount.push(avgAmount);
						addedAvg = 1;
					}
					tiersInfoText.push(tiersData[i]["warning-locked"]);
					tiersInfoAmount.push(tierValue);
				}
			}
			if (avgI > -1 && addedAvg === 0) {
				tiersInfoText.push(tiersData[avgI]["warning-locked"]);
				tiersInfoAmount.push(avgAmount);
			}
			//console.log(tiersInfoText);
			//console.log(tiersInfoAmount);

			var priceCounter = document.createElement("div");
			var priceCounterString = "";
			var difference = 0;
			for (var i = 0; i < tiersData.length; i++) {
				difference = tiersInfoAmount[i] - paidAmount - addedAmount;
				tiersInfoText[i] = tiersInfoText[i].replace('<%= money_difference %>', '$<span class="custom-tiers-inTextAmount">' + (difference / 100).toFixed(2) + '</span>');
				priceCounterString += '<div class="custom-tiers"><aside class="order-form-error-msg penny-error ">   <div class="order-form-error-text-container">     <p class="order-form-error-text">' + tiersInfoText[i] + '</p>     <a class="js-readjust-order-amount order-form-error-call-to-action">Add $<span class="custom-tiers-add">' + (difference / 100).toFixed(2) + '</span></a>   </div> </aside> </div>';
			}

			var masterAmountHolder = document.getElementsByClassName("master-amount")[0];
			var newOrderAmountHolder = document.getElementsByClassName("new-order-amount")[0];
			var customTiersHolder = document.getElementsByClassName("custom-tiers");
			var customTiersAddHolder = document.getElementsByClassName("custom-tiers-add");
			var customTiersInTextAmountHolder = document.getElementsByClassName("custom-tiers-inTextAmount");
			/*
			(async() => {
			if (window.location.href === "https://www.humblebundle.com/subscription#") {
			var tierCalcEleHolder = document.getElementsByClassName("download-page-wrapper js-download-page-wrapper page-header-text")[0];
			var tierCalcToogle = tdocument.createElement("div");
			tierCalcToogle.innerHTML = '   <input type="radio" id="custom-hints-on" name="custom-hints-toogle">   <label>On</label>   <input type="radio" id="custom-hints-off" name="custom-hints-toogle">   <label>Off</label>   <br> ';
			tierCalcEleHolder.appendChild("tierCalcToogle");
			let getCustomHintsToogle = await GM_getValue('customHints', 1);
			if (getCustomHintsToogle === 1) {
			document.getElementById("custom-hints-on").setAttribute('checked','');
			} else {
			document.getElementById("custom-hints-off").setAttribute('checked','');
			}
			/*
			var bundleString = "";
			await GM_setValue('customHints', bundleString);
			/
			}

			let getCustomHintsToogle = await GM_getValue('customHints', 0);
			})();*/

			function calculatePrice() {
				if (!(customTiersHolder.length > 0)) {
					var priceCounter = document.createElement("div");
					priceCounter.innerHTML = priceCounterString;
					document.getElementsByClassName("order-form-amount-error-container")[0].appendChild(priceCounter);
				}

				if (!(document.getElementsByClassName("radio-amount custom-radio-amount")[0].checked)) {
					var addedAmount = newOrderAmountHolder.innerHTML.substring(1) * 100;
				} else {
					var addedAmount = masterAmountHolder.value * 100;
				}

				if (!((typeof addedAmount) == "number")) {
					addedAmount = 0;
				}
				var differenceNumber = 0;
				for (var i = 0; i < tiersData.length; i++) {
					var differenceNumber = tiersInfoAmount[i] - paidAmount - addedAmount;
					if (differenceNumber <= 0) {
						customTiersHolder[i].style.display = "none";
					} else {
						customTiersHolder[i].style.display = "block";
					}
					customTiersAddHolder[i].innerHTML = (differenceNumber / 100).toFixed(2);
					if (i > 0) {
						customTiersInTextAmountHolder[i - 1].innerHTML = (differenceNumber / 100).toFixed(2);
					}
				}
			}
			calculatePrice();
			masterAmountHolder.addEventListener("input", calculatePrice);

			var priceOptions = document.getElementsByClassName("radio-amount");
			for (var i = 0; i < priceOptions.length; i++) {
				priceOptions[i].addEventListener("input", calculatePrice);
			}
			clearInterval(customPriceLoop);
		} else {
			if (customPriceCounter > 6) {
				clearInterval(customPriceLoop);
			}
		}
	}

	//if (window.location.href.indexOf("https://www.humblebundle.com/downloads?key=") === 0) { var customPriceLoop = setInterval(customPriceIncrease, 1000); };
	/* Humble Bundle custom price increase hints - end */

	/* Humble Bundle custom pause button color - start */
	var customPauseColor = '.js-pause-btn.button-v2.rectangular-button.blue {background-color: #42f542; border: 1px solid #42f542;}';
	addCssStyle(customPauseColor);

	/* Humble Bundle custom pause button color - end */

	/* Humble Bundle custom Humble Choice Selection menu button - start */
	var loadCounter4 = 0;

	function getHBselectionLink() {
		loadCounter4++;
		if (document.getElementsByClassName("tabs tabs-navbar-item").length > 0) {
			/*
			var curHBname = document.getElementsByClassName("simple-tile-view one-third monthly navbar-tile")[0].getElementsByClassName("name")[0].innerHTML.toLowerCase().split(" ");
			var curHBselection = "/subscription/" + curHBname[0] + "-" + curHBname[1] + "?hmb_source=navbar";
			 */
			/* month calculation - start */
			/* https://stackoverflow.com/questions/439630/create-a-date-with-a-set-timezone-without-using-a-string-representation */
			var today = new Date();
			//var today = new Date(Date.UTC(today.getUTCFullYear(), 4, 1, 3, 0, 0, 0));
			var firstDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1, 3, 0, 0, 0));
			var currentMonth = today.getUTCMonth();
			var currentYear = today.getUTCFullYear();
			var firstTuesdayN = -1;
			if (firstDay.getUTCDay() <= 2) {
				firstTuesdayN = firstDay.getUTCDate() + 2 - firstDay.getUTCDay();
			} else {
				firstTuesdayN = firstDay.getUTCDate() - (firstDay.getUTCDay() - 2) + 7;
			}
			/*
			var firstTuesday = firstDay;
			firstTuesday.setUTCDate(firstTuesdayN);
			console.log(firstDay);
			console.log(firstTuesday);
			 */
			if (today.getUTCDate() < firstTuesdayN || (today.getUTCDate() == firstTuesdayN && today.getUTCHours() < 17)) {
				if (currentMonth == 0) {
					currentMonth = 11;
					currentYear--;
				} else {
					currentMonth--;
				}
			}
			/* month calculation - end */
			var urlDateFragment = "";
			switch (currentMonth) {
			case 0:
				urlDateFragment = "january";
				break;
			case 1:
				urlDateFragment = "february";
				break;
			case 2:
				urlDateFragment = "march";
				break;
			case 3:
				urlDateFragment = "april";
				break;
			case 4:
				urlDateFragment = "may";
				break;
			case 5:
				urlDateFragment = "june";
				break;
			case 6:
				urlDateFragment = "july";
				break;
			case 7:
				urlDateFragment = "august";
				break;
			case 8:
				urlDateFragment = "september";
				break;
			case 9:
				urlDateFragment = "october";
				break;
			case 10:
				urlDateFragment = "november";
				break;
			case 11:
				urlDateFragment = "december";
				break;
			default:
				urlDateFragment = "\<wrong month\>";
			}

			var curHBselection = "https://www.humblebundle.com/membership/" + urlDateFragment + "-" + currentYear;

			console.log(curHBselection);
			var curChoiceEle = document.createElement("a");
			curChoiceEle.className = "navbar-item not-dropdown button-title";
			curChoiceEle.href = curHBselection;
			curChoiceEle.innerHTML = '<span class="navbar-icon-text-wrapper">      <span class="navbar-item-text">Choice Selection</span>    </span>';
			//if (document.getElementsByClassName("tabs tabs-navbar-item js-tabs-navbar-item js-maintain-scrollbar-on-dropdown").length > 0) {
			document.getElementsByClassName("tabs tabs-navbar-item")[0].appendChild(curChoiceEle);
			//}
			clearInterval(getHBselectionLinkLoop);
		} else {
			if (loadCounter4 > 8) {
				loadCounter4 = 0;
				console.log("Your main humble bundle menu took too long to load.");
				clearInterval(getHBselectionLinkLoop);
			}
		}
	}

	var getHBselectionLinkLoop = setInterval(getHBselectionLink, 1000);
	/* Humble Bundle custom Humble Choice Selection menu button - end */

	/* custom Humble Choice Link for game selection from Humble Choice purchases link  - start */
	function customChoiceLeftSelection() {
		if (document.getElementById("download-page-referral") && document.getElementsByClassName("js-choice-whitebox-holder").length > 0 && (document.getElementsByClassName("js-choice-whitebox-holder")[0].getElementsByClassName("button-v2 rectangular-button choice-selection").length === 0 || document.getElementsByClassName("js-choice-whitebox-holder")[0].getElementsByClassName("button-v2 rectangular-button choice-selection")[0].innerText.toLowerCase() === "get my games")) {
			var bundleName = document.getElementsByClassName("inner-main-wrapper")[0].getElementsByClassName("js-admin-edit")[0].getAttribute("data-machine-name");
			if (bundleName.indexOf("choice") !== -1) {
				var bundleNameString = bundleName.replace("_choice", "").replace("_", "-");
				var choiceLeft1 = document.createElement("div");

				var appendEle = document.getElementsByClassName("js-choice-whitebox-holder")[0];

				if (appendEle.getElementsByClassName("button-v2 rectangular-button choice-selection").length > 0 && appendEle.getElementsByClassName("button-v2 rectangular-button choice-selection")[0].innerText.toLowerCase().indexOf("get my games") === 0) {
					appendEle.getElementsByClassName("whitebox-redux choice-link-box")[0].style.display = "none";
				}
				choiceLeft1.className = "whitebox-redux choice-link-box";
				var choiceLeft2 = document.createElement("div");
				choiceLeft2.className = "choice-info wrapper";
				var choiceLeft21 = document.createElement("h2");
				choiceLeft21.className = "choice-title";
				choiceLeft21.textContent = "You have choices remaining!";
				var choiceLeft22 = document.createElement("p");
				choiceLeft22.className = "choice-description";
				choiceLeft22.innerHTML = 'You have <b id="custom-choice-left-number">X</b> choices remaining.\nVisit the Humble Choice member page to pick your games!';
				var choiceLeft23 = document.createElement("a");
				choiceLeft23.className = "button-v2 rectangular-button choice-selection";
				choiceLeft23.textContent = "Make My Choices";
				choiceLeft23.href = "https://www.humblebundle.com/membership/" + bundleNameString;

				choiceLeft2.appendChild(choiceLeft21);
				choiceLeft2.appendChild(choiceLeft22);
				choiceLeft2.appendChild(choiceLeft23);
				choiceLeft1.appendChild(choiceLeft2);

				appendEle.appendChild(choiceLeft1);
				var choiceLeftIframe = document.createElement("iframe");
				choiceLeftIframe.src = choiceLeft23.href;
				choiceLeftIframe.style = 'width: 0; height: 0; border: 0; border: none; position: absolute;';
				appendEle.appendChild(choiceLeftIframe);
				(async() => {
					await GM_setValue('currentChoicesLeft', -1);
					var waitForChoiceLeftTimeout = 0;
					async function waitForChoiceLeft() {
						waitForChoiceLeftTimeout++;
						let retrievedChoicesLeft = await GM_getValue('currentChoicesLeft', 0);
						if (retrievedChoicesLeft !== -1) {
							document.getElementById("custom-choice-left-number").textContent = retrievedChoicesLeft;
							choiceLeftIframe.src = "";
							clearInterval(waitForChoiceLeftLoop);
							if (waitForChoiceLeftTimeout > 10) {
								clearInterval(waitForChoiceLeftLoop);
							}
						}
					}
					var waitForChoiceLeftLoop = setInterval(waitForChoiceLeft, 1000);
				})();
			}
		}
	}
	if (window.location.href.indexOf("https://www.humblebundle.com/downloads?key=") === 0) {
		setTimeout(customChoiceLeftSelection, 500);
	}
	/* custom Humble Choice Link for game selection from Humble Choice purchases link  - end */
} else {
	/* iframe exclusive - retrives choices left from https://www.humblebundle.com/membership/<month>-<year> - start */
	function getChoicesLeft() {
		if (document.getElementsByClassName("choice-content-anchor").length > 0) {
			if (document.getElementsByClassName("inner-claimed-text").length > 0) {
				if (document.getElementsByClassName("inner-claimed-text")[0].innerText.toLowerCase().indexOf("claimed") == -1) {
					var choicesLeft = document.getElementsByClassName("inner-claimed-text")[0].innerText.split(" ")[0].trim() / 1;
				} else {
					var choicesLeft = 0;
				}
			} else {
				var choicesLeft = document.getElementsByClassName("choice-content-anchor").length - document.getElementsByClassName("claimed-text").length;
			}

			(async() => {
				await GM_setValue('currentChoicesLeft', choicesLeft);
			})();
		}
	}
	if (window.location.href.indexOf("https://www.humblebundle.com/membership/") == 0 && window.location.href.indexOf("-20") !== -1) {
		getChoicesLeft();
	}
	/* iframe exclusive - retrives choices left from https://www.humblebundle.com/membership/<month>-<year> - end */
}

//https://www.w3schools.com/html/html_tables.asp
//https://gomakethings.com/why-you-shouldnt-attach-event-listeners-in-a-for-loop-with-vanilla-javascript/
//https://stackoverflow.com/questions/7410784/how-can-i-limit-table-column-width
//javascript - TamperMonkey - message between scripts on different subdomains - https://qa.ostack.cn/qa/qa/?qa=1072014/
