angular.module('main').controller('HeaderController', HeaderController);
HeaderController.$inject = ['$scope', 'AppState', 'PhotoManager'];
function HeaderController($scope, AppState, PhotoManager) {
	var self = this;

	self.username = "";

	$scope.$watch(
		function() { return AppState.get('username'); }, 
		function(newVal, oldVal) { if(newVal !== oldVal) {
console.log(newVal);
		 self.username = newVal;	} }
	);

}

angular.module('main').controller('ContentController', ContentController);
ContentController.$inject = ['$scope', 'AppState', 'PhotoManager'];
function ContentController($scope, AppState, PhotoManager) {
	var self = this;
	var currentPhotoset = AppState.get('currentPhotoset');
	var currentIndex = 0;
	var currentPage = 1;

	self.photos = [];
	self.loadMorePhotos = function() {
		if(currentIndex % 10 > 8) { 
			// Ask the photo manager for more photos
		}

		if(currentPhotoset.count && currentIndex < currentPhotoset.count() - 1) {
			self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
			console.log(currentPhotoset.count(), currentIndex );
			
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	}
	self.hasMorePhotos = function() { 
		return (!currentPhotoset.count || currentIndex < currentPhotoset.count() );
	}

	PhotoManager.init();

	// Move this into the PhotoManager when we build the pub/sub system
	$scope.$watch(
		function() { return AppState.get('currentPhotoset'); }, 
		function(newVal, oldVal) { 
			if(newVal !== oldVal) {
				if(newVal.getPhotos) { 
					currentPhotoset = newVal; 
					self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
					self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
				}
			}
	});
}