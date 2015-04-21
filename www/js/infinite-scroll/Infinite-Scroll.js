angular.module('jp-infinite-scroll', [])
.directive('jpInfiniteScroll', InfiniteScroll);
InfiniteScroll.$inject = ['$window'];

function InfiniteScroll($window) {

	var Link = function(scope, element, attributes) { 
		angular.element(window).on("scroll", function( $event ) {
			scope.$apply(function() { 

				console.log($event);

			});
		});
	}

	return {
		restrict: "AE",
		scope: false,
		link: Link
	}	
}