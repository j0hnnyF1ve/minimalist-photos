angular.module('main').service('PhotoManager', PhotoManager);
PhotoManager.$inject = ['$interval', 'Photos', 'AppState', 'FlickrService'];
function PhotoManager($interval, Photos, AppState, FlickrService) {
	function photoManager() {
		var mInterval;
		var mInitCounter = 0;
		var mUserId = null;

		var in_username = 'jpballer97';
		var in_urlname = 'john_pangilinan';

		this.init = function() {

			mInterval = $interval(checkInit, 1000);

			FlickrService.getNSIDforUrlName(in_urlname).then(responseHandler);
			FlickrService.getNSIDforUsername(in_username).then(responseHandler);

			function responseHandler(response) { 
				if(response.stat == 'ok') {
					mUserId = response.user.id;
				}
				mInitCounter++;
			}
		}

		function checkInit() { 
			if(mInitCounter >= 2) { 
				$interval.cancel(mInterval); 
				setupUser();
			}
		}

		function setupUser() {
			if(mUserId) {
				AppState.set("username", in_username);

				FlickrService.getPublicPhotos(mUserId, 10, 1).then(function(response) { 
					var photos = new Photos();

					var list = response.photos.photo;
					for(var i=0; i < list.length; i++) {
						photos.addPhoto(list[i]);
					}

					AppState.set('currentPhotoset', photos);
				});
			}
		}
	}

	return new photoManager();
}