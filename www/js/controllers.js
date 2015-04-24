angular.module('main').controller('HeaderController', HeaderController);
HeaderController.$inject = ['$scope', '$state', 'AppState'];
function HeaderController($scope, $state, AppState) {
	var self = this;

	self.username = '';
	self.searchActive = false;
	self.searchTerm = '';

	self.searchHandler = function(event) {
		if(event.keyCode == 13) {
			self.searchActive = false;
			$state.go('main', { username: self.searchTerm} );
			self.username = self.searchTerm;

			self.searchTerm = '';
		}
	}

	$scope.$watch(
		function() { return AppState.get('username'); }, 
		function(newVal, oldVal) { 
			if(newVal !== oldVal) {
			self.username = newVal;	
		}}
	);

}

angular.module('main').controller('MainController', MainController);
MainController.$inject = ['$scope', '$state', '$stateParams', '$interval',
	'AppState', 'PhotoManager'];
function MainController($scope, $state, $stateParams, $interval,
	AppState, PhotoManager) {

	if(!$stateParams.username || $stateParams.username.length <= 0) { 
		$state.go('default');
		return; 
	}

	var self = this;
	var currentPhotoset = AppState.get('currentPhotoset');
	var currentIndex = 0;
	var isStart = true;

	var currentInterval;

	self.photos = [];

	// Method declarations
	self.loadMorePhotos = loadMorePhotos;
	self.hasMorePhotos = hasMorePhotos;

	// Init the photos for this view
	PhotoManager.init($stateParams.username);

	// Start: Method Implementations
	function loadMorePhotos() {
		// Once there are only two photos left before the bottom of the page, get more photos
		if(currentPhotoset.count && currentPhotoset.count() - currentIndex < 2) { 
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


	function hasMorePhotos() { 
		return (!currentPhotoset.count || currentIndex < currentPhotoset.count() );
	}


	// Move this into the PhotoManager when we build the pub/sub system
	// Note: Need to modify this to be more flexible, currently we rely on there being 10 photos per page to work properly
	$scope.$watch(
		function() { return AppState.get('currentPhotoset'); }, 
		function(newVal, oldVal) { 
			if(newVal !== oldVal) {
				if(newVal.getPhotos) { 
					currentPhotoset = newVal; 
					currentIndex = 0;
					
					if(isStart === true) {
						currentInterval = $interval(function() { 
							if(AppState.get('currentPhotoset').isLoaded() ) {
								self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
								self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );
								self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );

								$interval.cancel(currentInterval);
							}
						}, 1000);
						isStart = false;
					}
					else {
						currentInterval = $interval(function() { 
							if(AppState.get('currentPhotoset').isLoaded() ) {
								self.photos.push( currentPhotoset.getPhotoByIndex(currentIndex++) );

								$interval.cancel(currentInterval);
							}
						}, 1000);
					}
				}
			}
	});

	return this;
}

angular.module('main').controller('DefaultController', DefaultController);
DefaultController.$inject = ['$scope', '$location'];
function DefaultController($scope, $location) { 
      var self = this;
      self.domain = $location.absUrl();

      return this;
}