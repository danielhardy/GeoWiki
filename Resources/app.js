// This is a single context, single window application
// There is only one master window to which sub views will be added
(function() {


	//Open the wikipedia url;
	function openWikipedia(url){
		var wikiWin = Titanium.UI.createWindow({  
		    title:'Wikipedia',
		    url:'ui/WikipediaWindow.js',
		    borderRadius: 0,
		    barColor: '#4B5B60',
		    navBarHidden: false,
		    pageUrl: url
		});
		
		wikiWin.open({modal:true, animate:true});			
	}
	
	//Convert the HTTP response to Pins
	//TODO Move this function elsewhere;
	function convertResp2Pins(resp){
		var data = JSON.parse(resp);
		var pins = [];
		var pinCount = data.geonames.length;		
		//var pinCount = data.articles.length;
		
		if(pinCount === 0){
			alert("Sorry, no points of interest nearby.");
			return false;
		}
		
		//TODO remove this;
		Ti.API.info("Attempting to create "+pinCount+" pins");
		
		for(i=0; i<pinCount; i++){
			
			pins[i] = Titanium.Map.createAnnotation({
				image: 'pin.png',
				//These are alts for Geoname
	    		latitude: data.geonames[i].lat,
			    longitude: data.geonames[i].lng,			    
			    title: data.geonames[i].title,
				url: data.geonames[i].wikipediaUrl,
				//These are for wikiapi;
			    /*
			    latitude: data.articles[i].lat,
			    longitude: data.articles[i].lng,
			    title: data.articles[i].title,
				url: data.articles[i].mobileurl,
				*/
			    pincolor:Titanium.Map.ANNOTATION_PURPLE,
			    animate:true,
			    rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
			});
		}
		// Remove any annotations that might be on the map;
		mapview.removeAllAnnotations();
		// Place the pins on the map;
		mapview.addAnnotations(pins);
	}

	// When the app comes from the background we update location and get new pins;
	
	Ti.App.addEventListener('resumed', function(e){
		mapview.updatePins();
	});
	

	// Create the window
	var mapWin = Titanium.UI.createWindow({  
	    title:'Geopedia',
	    barColor: '#4B5B60',		    
		backgroundColor: '#335566',		
		tabBarHidden:true
	});
	
	// Create the map
	var mapview = Titanium.Map.createView({
	    mapType: Titanium.Map.STANDARD_TYPE,
	    animate:true,
	    regionFit:true,
	    location: {
	            latitudeDelta:0.03, 
	            longitudeDelta:0.03
	    },
	    userLocation:true
	});
	mapview.addEventListener('click', function(e){
		if(e.clicksource == 'rightButton'){
			// Open Wikipedia to the right URL;
			openWikipedia('http://'+e.annotation.url);
		}
	});	
	mapWin.add(mapview);
	
	// Create teh top bar;
	var topBar = Ti.UI.createView({
		left:9,
		right: 9,
		top: 9,
		height: 42,
		backgroundColor: '#ffffff',
		backgroundImage: 'bar.png',
		borderRadius: 5,
		zIndex: 3
	});
	
			
	// Add a refresh button;
	var refresh = Titanium.UI.createLabel({
		text: "r",
		right: 10,
		top: 10,
		bottom: 10,
		color: '#fff',
		font: 'fontello'
	});
	refresh.addEventListener('click', function(){
		// Make the Refresh Button Work
		mapview.updatePins();
	});
	topBar.add(refresh);	
	
	// Add the complete TopBar;
	mapWin.add(topBar);
	
	// Open the window;
	mapWin.open();
	

	
	// Add our Request Library;
	var ajax = require('ajax').Req;
	
	var API_BASE_URL = 'http://api.geonames.org/findNearbyWikipediaJSON';
	
	//var API_BASE_URL = 'http://api.wikilocation.org/articles';
	
	
	// Get the current location and pins;
	mapview.updatePins = function(){
		//Get the current location;			
		Titanium.Geolocation.purpose = "Determine your location to serve relevent articles";
		Titanium.Geolocation.getCurrentPosition(function(e){
			//Titanium.API.info('Your localization auth is '+Titanium.Geolocation.locationServicesAuthorization);
		
			LATITUDE_BASE = e.coords.latitude;
			LONGITUDE_BASE = e.coords.longitude;
		
			//Update the map location;
			mapview.setLocation({
				latitude: LATITUDE_BASE, 
				longitude: LONGITUDE_BASE, 
			});
			
			//Request the data;
			ajax({
				url: API_BASE_URL,
				method: 'GET',
				params: {
					lat: LATITUDE_BASE,
					lng: LONGITUDE_BASE,				
					username: 'dhardy',
					maxRows: 25
				},
				callback: function(resp){					
					convertResp2Pins(resp);					
				}
			});
		});
	}
	
	//get_location();
	mapview.updatePins();
	
	
})();