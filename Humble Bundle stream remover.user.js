// ==UserScript==
// @name         Humble Bundle stream remover
// @description  removes twitch stream from the humble bundle page and several hb tweaks
// @version      0.0.2.1
// @author       https://github.com/mmarcincin/userscripts
// @namespace    https://github.com/mmarcincin/userscripts
// @include      https://www.humblebundle.com/*
// @grant        none
// ==/UserScript==

function streamRemover() {
    if (document.getElementById("twitch-player")) {
        var twitch = document.getElementById("twitch-player");
        twitch.parentNode.removeChild(twitch);
    }
}

streamRemover();

var pageSize = 0;
var eleEvent = document.getElementsByClassName("js-user-item-dropdown-toggle js-navbar-dropdown js-maintain-scrollbar-on-dropdown js-user-navbar-item navbar-item navbar-item-dropdown user-navbar-item logged-in button-title no-style-button")[0];
function addDropdownLink() {
	if (document.getElementsByClassName("js-disable-body-scroll navbar-item-dropdown-items").length > 0) {
		var appendEle = document.getElementsByClassName("js-disable-body-scroll navbar-item-dropdown-items")[0];
		var troveLink = document.createElement("span");
		troveLink.innerHTML = '<a href="/monthly/trove?hmb_source=navbar" class="navbar-item-dropdown-item">       <i class="navbar-item-dropdown-icon hb hb-library has-perks"></i>       Trove     </a>';
		appendEle.insertBefore(troveLink, appendEle.getElementsByClassName("navbar-item-dropdown-item")[1]);
        var billingLink = document.createElement("span");
        billingLink.innerHTML = '<a href="/user/subscriptions/humble_monthly/billing?hmb_source=navbar" class="navbar-item-dropdown-item">      <i class="navbar-item-dropdown-icon hb hb-money has-perks"></i>      Billing    </a>'
        appendEle.insertBefore(billingLink, appendEle.querySelector('a[href="/user/settings?hmb_source=navbar"]'));
	}
}

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

var customPriceCounter = 0;
function customPriceIncrease() {
	customPriceCounter++;
	if (document.getElementsByClassName("master-amount").length > 0) {
		var tiersData = window.models.product_json.monetary_content_event_data;
		var tiersInfoText = []
		var tiersInfoAmount = []
		var avgAmount = Math.round(window.models.keyentity_json.avg * 100) + 1;
		var paidAmount = window.models.keyentity_json.cleanfamilytotal.amount * 100;
		//var addedAmount = document.getElementsByClassName("master-amount")[0].value * 100;
        var addedAmount = document.getElementsByClassName("new-order-amount")[0].innerHTML.substring(1) * 100;
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

		function calculatePrice() {
			if (!(document.getElementsByClassName("custom-tiers").length > 0)) {
				var priceCounter = document.createElement("div");
				priceCounter.innerHTML = priceCounterString;
				document.getElementsByClassName("order-form-amount-error-container")[0].appendChild(priceCounter);
			}
			//var addedAmount = document.getElementsByClassName("master-amount")[0].value * 100;
            var addedAmount = document.getElementsByClassName("new-order-amount")[0].innerHTML.substring(1) * 100;
			if (!((typeof addedAmount) == "number")) {
				addedAmount = 0;
			}
			var differenceNumber = 0;
			for (var i = 0; i < tiersData.length; i++) {
				var differenceNumber = tiersInfoAmount[i] - paidAmount - addedAmount;
				if (differenceNumber <= 0) {
					document.getElementsByClassName("custom-tiers")[i].style.display = "none";
				} else {
					document.getElementsByClassName("custom-tiers")[i].style.display = "block";
				}
				document.getElementsByClassName("custom-tiers-add")[i].innerHTML = (differenceNumber / 100).toFixed(2);
				if (i > 0) {
					document.getElementsByClassName("custom-tiers-inTextAmount")[i - 1].innerHTML = (differenceNumber / 100).toFixed(2);
				}
			}
		}
		document.getElementsByClassName("master-amount")[0].addEventListener("input", calculatePrice);
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


if (window.location.href.indexOf("https://www.humblebundle.com/downloads?key=") === 0) { var customPriceLoop = setInterval(customPriceIncrease, 1000); };
