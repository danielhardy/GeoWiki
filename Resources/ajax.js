/**
 * @description: Makes http requests (POST or GET)
 * 
 * @params: Config (Obj);
 * @returns: NONE
 * 
 * @comment: sample usage below
 * 
 * 		httpRequest( {
 *	        url:  'https://api.del.icio.us/v1/tags/get',
 *	        method: 'GET',
 *	        params: {
 *	        	var1 : 'foo',
 *	        	var2 : 'Bar
 *	        }
 *	        callback:  function(resp) {
 *	            //Your stuff;
 *	        }
 *	    });
 */
var httpRequest = function(config) {
	
	// This checks for connectivity and throws error if there isn't any;
	// Move this to Window init if you have to have network.
	if(Ti.Network.NETWORK_NONE){
		alert('This application requires a network connection.  Please try again later');
		return;
	}
	
	
	// Ceate the request object;
    var xhr = Titanium.Network.createHTTPClient({timeout: 60000});
	
	// if method is not set... set it!!!;
	if(!config.hasOwnProperty('method')){
		config.method = 'GET';
	}
	
	// Convert the params to proper format;
	var keypairString = JSON.stringify(config.params);
	
	// If we are GET'n stuff we need to url encode;
	// should we do this all the time??
	if(config.method === 'GET'){
		//need a different format for GET;
		keypairString = serialize(config.params);		
		config.url = config.url+'?'+keypairString;
		Titanium.API.log('DEBUG', config.url);
		config.params = null;
	}
	
   	// track the fire;
	Titanium.API.log('DEBUG', 'Preparing to make an httpRequest to '+config.url);
	
	// when done call the callback function;
    xhr.onload = function() { 
    	Ti.App.cookie = xhr.getResponseHeader("Set-Cookie"); 
    	Ti.App.cookieTime = new Date();
    	  	
        if(config.hasOwnProperty('callback')) {
            if(typeof config.callback == 'function') {            	
            	// log the return
				Titanium.API.log('LOG', this.responseText);
				
				//callback!
                config.callback(this.responseText);
            }
            else {
                Ti.API.error('getXML:  Invalid callback function');
            }
        }
    };
    // do something with errors;
    // TODO create feedback to user... alerts are cheap;
    xhr.onerror = function() {
        Ti.API.error('Problem: '+this.status + ' - ' + this.statusText);
        
        if(this.status == 0){
        	
        }
        //This should tell the user there was an error.
        alert('Error connecting to server. Please try again later.');
        //alert('Problem: '+this.status + ' - ' + this.statusText);
    };
	
	//Open the connection;
    xhr.open(config.method, config.url, false);
    
    // Add a header so the service knows what we want.
	xhr.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
	// Pretend we are chrome;
	xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.79 Safari/537.4");
    xhr.send(config.params);
};

/**
 * @description: Convert an object to Query string format
 * 
 * @params: obj (Obj)
 * @returns: string
 * 
 */
var serialize = function(obj) {
  var str = [];
  for(var p in obj)
     str.push(p + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}


//Make this available elsewhere;
module.exports.Req = httpRequest;