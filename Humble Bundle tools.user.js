// ==UserScript==
// @name         Humble Bundle tools
// @description  Total cost and game keys export
// @version      0.0.2.1
// @author       https://github.com/mmarcincin/userscripts
// @namespace    https://github.com/mmarcincin/userscripts
// @include      https://www.humblebundle.com/home/*
// @grant        none
// ==/UserScript==

/* Total cost script content for purchases - start */
var loadCounter1 = 0;
var lastRun1 = 0;

function humbleCalc() {
	loadCounter1++;
	if (document.getElementsByClassName("total").length > 0) {
		if (document.getElementsByClassName("js-unclaimed-purchases-loading").length > 0 && document.getElementsByClassName("js-unclaimed-purchases-loading")[0].style.display === "none") {
			//if (typeof(document.getElementsByClassName("total")[0]) != "undefined") {
			if (!(document.getElementById("prices"))) {
                var currencySigns = [ "$" ];
                var currencyValues = [ 0 ];
				do {
					var priceTable = document.getElementsByClassName("total");
                    
					for (i = 0; i < priceTable.length; i++) {
						var prodPrice = priceTable[i].innerHTML.trim();
						prodPrice = prodPrice.replace(",", ".");
						var regExp = /\d+\.\d+/g; 
                        var cValue = regExp.exec(prodPrice);
                        
                        if (typeof(cValue) !== "undefined" && cValue !== null) {
                            var cSign = prodPrice.replace(cValue[0],"");
                            cValue = cValue[0]/1;
                            var cSignNotFound = true;
                            for (j = 0; j < currencySigns.length; j++) {
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
                totalCost.innerHTML = "Total Cost";
                console.log(currencySigns.length);
                for (i = 0; i < currencySigns.length; i++) {
                    totalCost.innerHTML += " | " + currencySigns[i] + currencyValues[i].toFixed(2);
                    if ((i+1) % 3 == 0) {totalCost.innerHTML += "<br>";}
                }
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
		if(!(document.getElementById("humble-custom-gamelist"))) {
			//if (document.getElementsByClassName("keyfield redeemed").length > 0) {document.getElementById("hide-redeemed").click();}
			var gameListAll = [];
			var gameList = [];
			
			var x2 = document.createElement('textarea');
			x2.setAttribute("id", "humble-custom-gamelist");
			x2.setAttribute("style", "resize:none");
			x2.setAttribute("rows", "10");
			x2.setAttribute("cols", "50");
			x2.readOnly = true;
			x2.style.display = "none";
			
			var gameListTitle = "";
			function saveTextAsFile()
			{
				var textToWrite = document.getElementById('humble-custom-gamelist').value;
				var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
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
			button21.setAttribute('title', 'Copy complete game list to clipboard');

			var span21 = document.createElement('span');
			span21.setAttribute('class', 'humble-uix-button-content');
			span21.innerHTML = 'Copy';
			button21.appendChild(span21);
			
			var button22 = document.createElement('button');
			button22.setAttribute('type', 'button');
			button22.setAttribute('id', 'button-save1');
			button22.setAttribute('onclick', ';return false;');
			button22.setAttribute('title', 'Save complete game list as file');

			var span22 = document.createElement('span');
			span22.setAttribute('class', 'humble-uix-button-content');
			span22.innerHTML = 'Save File';
			button22.appendChild(span22);

			/* unredeemed game list buttons */
			var button23 = document.createElement('button');
			button23.setAttribute('type', 'button');
			button23.setAttribute('id', 'button-copy2');
			button23.setAttribute('onclick', ';return false;');
			button23.setAttribute('title', 'Copy unredeemed game list to clipboard');

			var span23 = document.createElement('span');
			span23.setAttribute('class', 'humble-uix-button-content');
			span23.innerHTML = 'Copy';
			button23.appendChild(span23);
			
			var button24 = document.createElement('button');
			button24.setAttribute('type', 'button');
			button24.setAttribute('id', 'button-save2');
			button24.setAttribute('onclick', ';return false;');
			button24.setAttribute('title', 'Save unredeemed game list as file');

			var span24 = document.createElement('span');
			span24.setAttribute('class', 'humble-uix-button-content');
			span24.innerHTML = 'Save File';
			button24.appendChild(span24);
			function getGamesList() {
				gameListAll = [];
				gameList = [];
				var nextPageId2 = document.getElementsByClassName("pagination").length-2;
				do {
					var gameTable = document.getElementsByClassName("game-name");
					for (i = 1; i < gameTable.length; i++) {
						var gameTitle = gameTable[i].getElementsByTagName("h4")[0].innerHTML;
						var bundleTitle = gameTable[i].getElementsByTagName("a")[0].innerHTML;
						if (gameTitle === bundleTitle) { bundleTitle = "Humble Store" }
						//var addString = gameTitle + " | " + bundleTitle;
						var addString = "<tr>\n<td>" + gameTitle + "</td>\n<td>" + bundleTitle + "</td>\n</tr>\n";
						if (gameTable[i].parentNode.getElementsByClassName("keyfield redeemed").length === 0) { gameList.push(addString); }
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
			}
			
			var modEle2 = document.getElementsByClassName("sort")[document.getElementsByClassName("sort").length-1];
			modEle2.appendChild(x2);
			var buttonsElement = document.createElement("div");
			var blankSpace2 = document.createElement("span");
			blankSpace2.style.marginRight = "20px";
			buttonsElement.innerHTML += "Complete Game List: ";      
			buttonsElement.appendChild(button21);
			buttonsElement.appendChild(button22);
			buttonsElement.appendChild(blankSpace2);
			buttonsElement.innerHTML += "Unredeemed Game List: ";
			buttonsElement.appendChild(button23);
			buttonsElement.appendChild(button24);
			
			modEle2.appendChild(buttonsElement);
			
			function addCompleteGameList() {
				getGamesList();
				var copyText = document.getElementById("humble-custom-gamelist");
				var tempText = "<html>\n<head>\n<style>\ntable, th, td {border: 1px solid black; border-collapse: collapse;}\nth, td {max-width: 500px; padding: 5px;}\ntd {word-wrap: break-word;}\ntr:nth-child(even) {background-color: #dddddd;}\n</style>\n</head>\n<body>\n<h2>Humble Bundle Complete Game List</h4>\n";
                tempText += "<table>\n<tr>\n<th>Game Name</th>\n<th>Bundle Name</th>\n</tr>" + "\n";
				for (i = 0; i < gameListAll.length; i++) {
					tempText += gameListAll[i] +"\n";
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
				var tempText = "<html>\n<head>\n<style>\ntable, th, td {border: 1px solid black; border-collapse: collapse;}\nth, td {max-width: 500px; padding: 5px;}\ntd {word-wrap: break-word;}\ntr:nth-child(even) {background-color: #dddddd;}\n</style>\n</head>\n<body>\n<h2>Humble Bundle Unredeemed Game List</h4>\n";
                tempText += "<table>\n<tr>\n<th>Game Name</th>\n<th>Bundle Name</th>\n</tr>" + "\n";
				for (i = 0; i < gameList.length; i++) {
					tempText += gameList[i] +"\n";
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
		for (i = 0; i < barButtons.length; i++) {
			if (barButtons[i].href.indexOf("/home/purchases") !== -1) {
				barButtons[i].id = "purchases_button";
				barButtons[i].addEventListener('click', function () {
					nextPageQ1 = setInterval(humbleCalc, 1000);}); 
			}
			if (barButtons[i].href.indexOf("/home/keys") !== -1) {
				barButtons[i].id = "keys_button";
				barButtons[i].addEventListener('click', function () {
					nextPageQ2 = setInterval(humbleGetGames, 1000);}); 
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

var nextPageQ3 = setInterval(enhancedBar, 1000);

if (window.location.href === "https://www.humblebundle.com/home/purchases") {
	var nextPageQ1 = setInterval(humbleCalc, 1000);
} else {
	if (window.location.href === "https://www.humblebundle.com/home/keys") {
		var nextPageQ2 = setInterval(humbleGetGames, 1000);
	}
}


//var barButtons = document.getElementsByClassName("tabbar-tab"); for (i = 0; i < barButtons.length; i++) {if (barButtons[i].href.indexOf("/home/purchases")!==-1) { barButtons[i].addEventListener('click', function () {var nextPageQ1 = setInterval(humbleCalc, 1000);}); break;}}
//
//https://www.w3schools.com/html/html_tables.asp
//https://gomakethings.com/why-you-shouldnt-attach-event-listeners-in-a-for-loop-with-vanilla-javascript/
//https://stackoverflow.com/questions/7410784/how-can-i-limit-table-column-width