// ==UserScript==
// @name         GOG.com enhancement tools
// @description  library export based on sorting + compact view
// @version      0.0.1
// @author       https://github.com/mmarcincin/userscripts
// @namespace    https://github.com/mmarcincin/userscripts
// @include      https://www.gog.com/account*
// @grant        none
// ==/UserScript==

/* user config */

//compact view on load 1 for yes, 0 for no
var compactViewLoad = 0;


/* script */

var viewMode1 = 0;

if (typeof (document.getElementsByClassName("product-title__text")[0]) !== "undefined") {
	/* Generating div1 and textarea in div1 */
	var div1 = document.createElement('div');
	div1.setAttribute('id', 'gog-custom-gamelist-div');

	var x2 = document.createElement('textarea');
	x2.setAttribute("id", "gog-custom-gamelist");
	x2.setAttribute("style", "resize:none");
	x2.setAttribute("rows", "10");
	x2.setAttribute("cols", "120");
	x2.readOnly = true;

	div1.appendChild(x2);

	function copySelectionText(){
		var copysuccess; // var to check whether execCommand successfully executed
		try{
			copysuccess = document.execCommand("copy"); // run command to copy selected text to clipboard
		} catch(e){
			copysuccess = false;
		}
		return copysuccess;
	}

	/* Create playlist button (button1) */
	var button1 = document.createElement('button');
	//button1.setAttribute('class', 'yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-has-icon no-icon-markup  yt-uix-tooltip');
	button1.setAttribute('type', 'button');
	button1.setAttribute('onclick', ';return false;');
	button1.setAttribute('id', 'gog-generate-custom-gamelist');
	button1.setAttribute('title', 'Create gamelist based on active sorting');
	button1.setAttribute('value', 'off');
	var span1 = document.createElement('span');
	span1.innerHTML = 'Create gamelist';
	button1.appendChild(span1);

	/* refreshes games list when sorting is changed */
    var sortMode = document.getElementsByClassName("header__dropdown module-header-dd");
        for (i = 0; i < sortMode.length; i++) {
            if (sortMode[i].getAttribute("hook-test") === "sortingLibraryDropdownButton") {
                sortOptions = sortMode[i].getElementsByClassName("_dropdown__item");
                for (j = 0; j < sortOptions.length; j++) {
                    //console.log(sortOptions[j].getAttribute("ng-click"));
	                sortOptions[j].addEventListener('click', generateListDelayed);
                }
            }
        }
		
    function generateListDelayed() { if (button1.value=='on') {setTimeout(generateList, 1000);} }
    function generateList() {
            var gamesList1 = document.getElementsByClassName("product-title__text");
			x2.value = document.getElementsByClassName("product-title__text")[0].innerHTML;
			for (i=1; i<gamesList1.length; i++) {
				x2.value = x2.value + "\n" + document.getElementsByClassName("product-title__text")[i].innerHTML;
			}
			var textfield1 = document.getElementsByClassName("module-header collection-header cf")[0];
			//var textfield1 = document.getElementsByClassName("module module--filters filters")[0];

			if (!(textfield1.contains(div1))) {
				textfield1.appendChild(div1);
			}
    }
    /**/
  
    /* add onclick event to button1 using the addEventListener() method */
	/* Retrieve data and generate gamelist in textarea */
	button1.addEventListener('click', function () {
		if (button1.value=='off') {
            generateList();

			button1.value = "on";
			button1.setAttribute("title","Hide gamelist text field");
			span1.innerHTML = "Hide gamelist";
			div1.style.display = "block";
            refreshView();
		}else{
			button1.value = "off";
			button1.setAttribute("title","Create gamelist in text field");
			span1.innerHTML = "Create gamelist";
			div1.style.display = "none";
            refreshView();
		}
	});
  //######################
    /* Copy button(button3) in div1 */
		var button3 = document.createElement('button');
		//button1.setAttribute('class', 'yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-has-icon no-icon-markup yt-uix-playlistlike  yt-uix-tooltip');
		button3.setAttribute('type', 'button');
		button3.setAttribute('onclick', ';return false;');
		button3.setAttribute('title', 'Copy all text in text field');

		var span3 = document.createElement('span');
		span3.setAttribute('class', 'gog-uix-button-content');
		span3.innerHTML = 'Copy';
		button3.appendChild(span3);

		button3.addEventListener('click', function () {
			var field1 = document.getElementById('gog-custom-gamelist');
			field1.focus();
			field1.setSelectionRange(0, field1.value.length);
			var copysuccess = copySelectionText();
			if (copysuccess){
				//showtooltip(Copied);
			}
		});

		/* Save button(button4) in div1 */
		var button4 = document.createElement('button');
		//button1.setAttribute('class', 'yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-has-icon no-icon-markup yt-uix-playlistlike  yt-uix-tooltip');
		button4.setAttribute('type', 'button');
		button4.setAttribute('onclick', ';return false;');
		button4.setAttribute('title', 'Save gamelist to text file');

		var span4 = document.createElement('span');
		span4.setAttribute('class', 'gog-uix-button-content');
		span4.innerHTML = 'Save gamelist';
		button4.appendChild(span4);

		function saveTextAsFile()
		{
			var textToWrite = document.getElementById('gog-custom-gamelist').value;
			var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
            var gogAccountName = document.getElementById("menuUsername").innerHTML;
			var fileNameToSaveAs = gogAccountName + "'s_GOG_games.txt";
			
			var downloadLink = document.createElement("a");
			downloadLink.download = fileNameToSaveAs;
			downloadLink.innerHTML = "Download File";
			
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
			downloadLink.click();
		}
		
		button4.addEventListener('click', saveTextAsFile);
        
        div1.appendChild(button3);
        div1.appendChild(button4);
  //######################


	if (typeof (document.getElementsByClassName("module module--filters filters")[0]) !== "undefined") {
		var textfield1 = document.getElementsByClassName("module module--filters filters")[0];
		textfield1.appendChild(button1);
	}

	/* compact view */

	function hidePics(){
		var proPics1 = document.getElementsByClassName("product-row__picture");
		var end1 = proPics1.length;
		for (i=0; i<end1; i++){
			proPics1[i].style.display = "none";
		}
	}

	function showPics(){
		var proPics1 = document.getElementsByClassName("product-row__picture");
		var end1 = proPics1.length;
		for (i=0; i<end1; i++){
			proPics1[i].style.display = "block";
		}   
	}

	//source: https://stackoverflow.com/questions/15505225/inject-css-stylesheet-as-string-using-javascript

	function addCssStyle(rule) {
		var css = document.createElement("style"); // Creates <style></style>
		css.id = "compactViewStyle";
		css.type = "text/css"; // Specifies the type
		if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
		else css.appendChild(document.createTextNode(rule)); // Support for the rest
		document.getElementsByTagName("head")[0].appendChild(css); // Specifies where to place the css
	}

	function compactView(){
		//hidePics();
		
		var rule = ".list--rows .product-row__content-in {height: auto}";
		rule += ".gogmix:not(.product-row--grid):not(.product-row--micro) .gogmix__content, .gogmix:not(.product-row--grid):not(.product-row--micro) .product-row__content, .product-row:not(.product-row--grid):not(.product-row--micro) .gogmix__content, .product-row:not(.product-row--grid):not(.product-row--micro) .product-row__content {line-height: initial}";
		rule += ".gogmix__content, .product-row__content {line-height: initial}";
		rule += ".gogmix, .product-row {height: auto}";
		//rule += ".list--rows .product-row__title {vertical-align: initial; margin-top: initial}";
        rule += ".list--rows .product-row__title {vertical-align: initial; margin-top: 4px; margin-bottom: 3px}";
		//22px was needed to cancel out cascading effect (from right to left) of os icons, breaks on zoom
		//rule += ".product-row__alignment.gogmix__author, .product-row__info.product-row__alignment {line-height: 22px}";
		rule += ".gogmix__content-in, .product-row__content-in {line-height: 1.30}";
		rule += ".list--rows .product-row__info.product-row__alignment:before {height: auto}";
        rule += ".product-row__picture {display: none}";
        rule += ".list--grid .product-row .product-row__picture {display: none}";      
		//rule += "\r\n";
		//window.onload = function() { addCssStyle(rule) };
		
		addCssStyle(rule);
      
		if (compactViewLoad == 1) {
			button2.value = "on";
			button2.setAttribute("title","Initial library view");
			span2.innerHTML = "Standard view";
		}
	}

	function standardView(){
		//showPics();
		var element1 = document.getElementById("compactViewStyle");
		element1.parentNode.removeChild(element1);
	}
  
    function refreshView(){
        var gridMode1 = document.querySelector(".header__dropdown.module-header-dd._dropdown.is-contracted span[ng-show='view.isInGridMode']");
            if (gridMode1.className !== "ng-hide") { viewMode1 = 0; } else { viewMode1 = 1; }
     
        var viewModes = document.getElementsByClassName("_dropdown__items module-header-dd__items");
        for (i = 0; i < viewModes.length; i++) {
            if (viewModes[i].parentNode.contains(gridMode1)) {
	            viewModes[i].getElementsByClassName("_dropdown__item")[viewMode1].click();
            }
        }
    }

	if (compactViewLoad == 1) setTimeout(compactView,1000);

	/* Create compact view button (button2) */
	var button2 = document.createElement('button');
	button2.setAttribute('type', 'button');
	button2.setAttribute('onclick', ';return false;');
	button2.setAttribute('id', 'gog-library-compact-view');
	button2.setAttribute('title', 'Create compact view for list sorting');
	button2.setAttribute('value', 'off');
	var span2 = document.createElement('span');
	span2.innerHTML = 'Compact view';
	button2.appendChild(span2);

	if (typeof (document.getElementsByClassName("module module--filters filters")[0]) !== "undefined") {
		var textfield1 = document.getElementsByClassName("module module--filters filters")[0];
		textfield1.appendChild(button2);
	}

	button2.addEventListener('click', function() {
		if (button2.value=='off') {
			button2.value = "on";
			button2.setAttribute("title","Initial library view");
			span2.innerHTML = "Standard view";
            compactView();
            refreshView();
			/*compactView().then(function() {
                refreshView();
            });*/
		}else{
			button2.value = "off";
			button2.setAttribute("title","Create compact library view for list sorting");
			span2.innerHTML = "Compact view";
            standardView();
            refreshView();
		    /*standardView().then(function() {
                refreshView();
            });
      */
		}
	});
}

/*
//div.product-row__content-in
.list--rows .product-row__content-in
height: 60

.gogmix:not(.product-row--grid):not(.product-row--micro) .gogmix__content, .gogmix:not(.product-row--grid):not(.product-row--micro) .product-row__content, .product-row:not(.product-row--grid):not(.product-row--micro) .gogmix__content, .product-row:not(.product-row--grid):not(.product-row--micro) .product-row__content
line-height: 54px

// this one makes difference like compact and cozy display on gmail (line height difference)
.gogmix__content, .product-row__content
line-height: 35px

.gogmix, .product-row
height: 60px

//div.product-row__title 
.list--rows .product-row__title
vertical-align: top

.list--rows .product-row__title
margin-top: 19px

//div.product-row__info.product-row__alignment
.product-row__alignment.gogmix__author, .product-row__info.product-row__alignment
line-height: 0

.list--rows .product-row__info.product-row__alignment:before
height: 34px

*/

/*
function remPics(){
var proPics1 = document.getElementsByClassName("product-row__picture");
var alert11=0;
var end1 = proPics1.length;
//proPics1 length get smaller with each removal so you have to save total length to variable, otherwise you will remove only first half of all the elements
//you need to keep removal on first field of array othewise you'll get only every 2nd element removed
for (i=0; i<end1; i++){
proPics1[0].parentNode.removeChild(proPics1[0]);
alert11++;  
}
alert(alert11);
}
setTimeout(remPics,1000);
*/