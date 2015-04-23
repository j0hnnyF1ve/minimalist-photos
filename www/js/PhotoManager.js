angular.module('main').service('PhotoManager', PhotoManager);
PhotoManager.$inject = ['$interval', '$state', 'Photos', 'AppState', 'FlickrService',
	'UserModel'];
function PhotoManager($interval, $state, Photos, AppState, FlickrService, 
	UserModel) {
	function photoManager() {
		var mInterval;
		var mInitCounter = 0;
		var mUserId = null;
		var mCurrentPage = 1;
		var mNumPhotos = 10;

		var mUsername = '';

		var tempUsername = '';

		this.init = function(username) {
			mUserId = null;
			mUsername = '';
			mCurrentPage = 1;

			tempUsername = username;
			mInterval = $interval(_checkInit, 1000);

			FlickrService.getNSIDforUrlName(username).then(responseHandler);
			FlickrService.getNSIDforUsername(username).then(responseHandler);

			function responseHandler(response) { 
				if(response.stat == 'ok') {
					mUserId = response.user.id;
				}
				mInitCounter++;
			}
		}

		this.getMorePhotos = function() { 
			return _getPhotos(mNumPhotos, ++mCurrentPage);
		}


		function _checkInit() { 
			if(mInitCounter >= 2) { 
				$interval.cancel(mInterval); 
				_setupUser();
			}

			function _setupUser() {
				if(mUserId) {
					mUsername = tempUsername;
					FlickrService.getUserInfo(mUserId)
						.then(_setupUserInfo);
					AppState.set('username', mUsername);
					_getPhotos(mNumPhotos, mCurrentPage);
				} 
				else { 
					AppState.set('username', '');
					$state.go('default'); 

				}
			}

			function _setupUserInfo(response) {
				if(!response.person) { return; }
				var person = response.person || {};
				AppState.set('userInfo', new UserModel(person) ); 

				console.log(AppState.get('userInfo'));
			}
		}


		function _getPhotos(numPhotos, pageNum) { 
			return FlickrService.getPublicPhotos(mUserId, numPhotos, pageNum).then(function(response) {

				var photos = new Photos();

				var list = response.photos.photo;
				for(var i=0; i < list.length; i++) {
					photos.addPhoto(list[i]);
				}

				AppState.set('previousPhotoset', AppState.get('currentPhotoset') );
				AppState.set('currentPhotoset', photos)
			});
		}
	}

	return new photoManager();
}