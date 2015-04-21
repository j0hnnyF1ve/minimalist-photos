angular.module('main').controller('HeaderController', HeaderController);
HeaderController.$inject = ['$scope', 'AppState', 'PhotoManager'];
function HeaderController($scope, AppState, PhotoManager) {
	var self = this;

	self.username = "";

	$scope.$watch(
		function() { return AppState.get('username'); }, 
		function(newVal, oldVal) { 
			if(newVal !== oldVal) {
			self.username = newVal;	
		}}
	);

}

angular.module('main').controller('ContentController', ContentController);
ContentController.$inject = ['$scope', 'AppState', 'PhotoManager'];
function ContentController($scope, AppState, PhotoManager) {
	var self = this;
	var currentPhotoset = AppState.get('currentPhotoset');
	var currentIndex = 0;

	self.photos = [];
	self.loadMorePhotos = function() {
		// Once there are only two photos left before the bottom of the page, get more photos
		if(currentPhotoset.count() - currentIndex < 2) { 
			// Ask the photo manager for more photos
			PhotoManager.getMorePhotos();
		}

		// As long as we haven't exceeded the photo count, load in the next photo
		if(currentPhotoset.count && currentIndex < currentPhotoset.count() ) {
			self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
			console.log(currentPhotoset.count(), currentIndex );
			
			// tell the ion-infinite-scroll directive that the infinite scroll is complete
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	}
	self.hasMorePhotos = function() { 
		return (!currentPhotoset.count || currentIndex < currentPhotoset.count() );
	}

	PhotoManager.init();

	// Move this into the PhotoManager when we build the pub/sub system
	// Note: Need to modify this to be more flexible, currently we rely on there being 10 photos per page to work properly
	$scope.$watch(
		function() { return AppState.get('currentPhotoset'); }, 
		function(newVal, oldVal) { 
			if(newVal !== oldVal) {
				if(newVal.getPhotos) { 
					currentPhotoset = newVal; 
					currentIndex = 0;
					self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
					self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
				}
			}
	});
}