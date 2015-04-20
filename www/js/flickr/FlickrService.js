angular.module('flickr', [])

.constant('FlickrENV', {
	'endpoint' : 'https://api.flickr.com/services/rest/',
	'api_key' : 'f100f808b8501d88fae083df7dc7d7a6',
})

.service('FlickrService', ['$http', '$q', 'FlickrENV',  function($http, $q, FlickrENV) { 
	var rootUrl = FlickrENV.endpoint + 
		'?api_key=' + FlickrENV.api_key + 
		'&format=json&nojsoncallback=1';

	return {
		getPublicPhotos : function(NSID, per_page, page) {
			if(!NSID) { return; }
			per_page = per_page || 10;
			page = page || 1;

			var promise = callFlickr({method: 'getPublicPhotos', extras: {per_page: per_page, page: page, user_id: NSID} });
			return promise;
		},

		getNSIDforUsername : function(username) { 
			var promise = callFlickr({method: 'findByUsername', extras: {username: username} });
			return promise;
		},

		getNSIDforUrlName : function(urlName) { 
			var flickrUrl = 'https://www.flickr.com/photos/' + urlName + '/';
			var promise = callFlickr({ method: 'lookupUser', extras: {url: flickrUrl} });
			return promise;
		}
	}

	function callFlickr(params) {
		if(!params.method) { throw Exception('No method passed to Flickr'); return null; }
		var url = rootUrl; 
		url += "&method=" + getMethod(params.method);
		for(var index in params.extras) {
			url += "&" + index + "=" + params.extras[index];
		}

		var deferred = $q.defer(); 
		$http({ url: url, 
			method: 'GET', 
			dataType: 'json'
		})
			.success( function(data) { 
				deferred.resolve(data);
			})
			.error( function() { 
				deferred.reject('FlickrService: An error occurred while calling Flickr: ' + url);
			});
		return deferred.promise;
	}

	function getMethod(method) { 
		switch(method) {
			case 'getPublicPhotos': return 'flickr.people.getPublicPhotos';
			case 'findByUsername': return 'flickr.people.findByUsername';
			case 'lookupUser': return 'flickr.urls.lookupUser';
			default: return '';
		}
	}
}])

;