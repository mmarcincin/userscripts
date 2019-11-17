// ==UserScript==
// @name         Humble Bundle stream remover
// @description  removes twitch stream from the humble bundle page and several hb tweaks
// @version      0.0.2.2
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