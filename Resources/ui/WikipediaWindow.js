/**
 * WikipediaWindo
 * 
 * @author Daniel Hardy
 * @description - Handles the creation of the wikipedia window
 * @TODO - Add navigation bar to control history;
 */

//Get context;
var win = Titanium.UI.currentWindow;

//Create a WebView;
var wikiView = Titanium.UI.createWebView({
	url: win.pageUrl
});

//Create the close button;
var wikiClose = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.CANCEL
});
wikiClose.addEventListener('click', function(){
	win.close();
})
win.setLeftNavButton(wikiClose);

//Assemble Window;
win.add(wikiView);