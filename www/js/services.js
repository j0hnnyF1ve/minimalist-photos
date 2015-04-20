angular.module('main').factory('Photos', Photos);
Photos.$inject = ['PhotoModel'];
function Photos(PhotoModel) {
	
	function photos() {
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

	return photos;
}

angular.module('main').factory('PhotoModel', PhotoModel);
PhotoModel.$inject = [];
function PhotoModel() {
	function Photo(photo) {
		this.caption = photo.title || "";

		this.thumbnailUrl = "http://farm" + photo.farm + ".static.flickr.com/" + 
							        photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
		this.photoUrl = "http://farm" + photo.farm + ".static.flickr.com/" + 
							        photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
		this.bigPhotoUrl = "http://farm" + photo.farm + ".static.flickr.com/" + 
							        photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
		this.pageUrl = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
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