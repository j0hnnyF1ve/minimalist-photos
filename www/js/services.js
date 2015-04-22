angular.module('main').factory('Photos', PhotosModel);
PhotosModel.$inject = ['PhotoModel'];
function PhotosModel(PhotoModel) {
	
	function Photos() {
		var self = this;
		var mPhotos = [];
		
		self.getPhotos = function() { return mPhotos;}		
		self.setPhotos = function(in_photos) { mPhotos = in_photos;	}
		self.clearPhotos = function() { mPhotos = []; }

		self.getPhotoByIndex = function(index) { return (index >= 0) ? mPhotos[index] : null; } 
		self.addPhoto = function(photo) { 
			mPhotos.push(new PhotoModel(photo) ); 
		}
		self.count = function() { return mPhotos.length; }
	}

	return Photos;
}

angular.module('main').factory('PhotoModel', PhotoModel);
PhotoModel.$inject = ['$log'];
function PhotoModel($log) {
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

		var bigImage = new Image();
		bigImage.src = self.bigPhotoUrl;
		bigImage.onload = function() { $log.log(self.bigPhotoUrl + ' has loaded!'); }
	}
	return Photo;
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
		
		self.get = function(property) { return properties[property];}
		self.set = function(property, value) { properties[property] = value;	}
	}

	return new appState();
}