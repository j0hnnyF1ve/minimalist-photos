angular.module('main').factory('Photos', PhotosModel);
PhotosModel.$inject = ['PhotoModel', '$log'];
function PhotosModel(PhotoModel, $log) {
	
	function Photos() {
		var self = this;
		var mPhotos = [];

		var numImagesLoaded = 0;
		var numImages = 0;
		
		self.getPhotos = function() { return mPhotos;}		
		self.setPhotos = function(in_photos) { mPhotos = in_photos;	}
		self.clearPhotos = function() { mPhotos = []; }

		self.getPhotoByIndex = function(index) { return (index >= 0) ? mPhotos[index] : null; } 
		self.addPhoto = function(photo) { 
			var photoModel = new PhotoModel(photo);
			var bigImage = new Image();
			bigImage.src = photoModel.bigPhotoUrl;
			bigImage.onload = function() { 
				numImagesLoaded++;
				$log.log(this.src + ' has loaded!'); 
			}

			mPhotos.push(photoModel); 
		}
		self.count = function() { return mPhotos.length; }

		self.isLoaded = function() { 
			return numImagesLoaded === self.count();
		}

	}

	return Photos;
}

angular.module('main').factory('PhotoModel', PhotoModel);
PhotoModel.$inject = [];
function PhotoModel() {
	function Photo(photo) {
		var self = this;
		self.caption = photo.title || "";

		self.thumbnailUrl = "http://farm" + photo.farm + ".static.flickr.com/" + 
							        photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
		self.photoUrl = "http://farm" + photo.farm + ".static.flickr.com/" + 
							        photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
		self.bigPhotoUrl = "http://farm" + photo.farm + ".static.flickr.com/" + 
							        photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
		self.pageUrl = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;

	}
	return Photo;
}

angular.module('main').factory('UserModel', UserModel);
UserModel.$inject = ['$log'];
function UserModel($log) {
	// 'user' is a response object returned from Flickr, the UserModel is in charge of parsing object into a UserModel
	function User(user) { 
		var photoInfo = user.photos || {};

console.log(user);

		var self = this;
		self.username 		= getData(user.username);
		self.realname 		= getData(user.realname);
		self.description 	= getData(user.description);
		self.location 		= getData(user.location);
		self.mobileUrl 		= getData(user.mobileurl);
		self.photosUrl 		= getData(user.photosurl);
		self.profileUrl 	= getData(user.profileurl);
		self.firstDate 		= getData(photoInfo.firstdate);
		self.firstDateTaken = getData(photoInfo.firstdatetaken);
		self.photoCount 	= getData(photoInfo.count);
		
		// https://www.flickr.com/services/api/misc.buddyicons.html
		self.iconUrl		= 'http://farm' + user.iconfarm + '.staticflickr.com/' + user.iconserver + 
								'/buddyicons/' + user.nsid + '.jpg';

		function getData(data) { 
			if(!data) { return ''; }
			if(data['content']) { return data['content']; }
			else if(data['_content']) { return data['_content']; }
			else { return '';}
		}
	}
	return User;
}

angular.module('main').service('AppState', AppState);
AppState.$inject = [];
function AppState() {
	
	function appState() {
		var self = this;
		var properties = [];
		properties.previousPhotoset = [];
		properties.currentPhotoset = [];
		properties.nextPhotoset = [];
		properties.username = "";
		properties.userInfo = null;
		
		self.get = function(property) { return properties[property];}
		self.set = function(property, value) { properties[property] = value;	}
	}

	return new appState();
}