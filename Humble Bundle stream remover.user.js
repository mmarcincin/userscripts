// ==UserScript==
// @name         Humble Bundle stream remover
// @description  Removes twitch stream from the Humble Bundle pages
// @version      0.0.1
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