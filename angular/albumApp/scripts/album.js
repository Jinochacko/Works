function albumController ($scope, $http){

	$scope.images = [{"src":"../images/Mia George(5).jpg", "name":"mia"},
			 {"src":"../images/Nazriya-Nazim1.jpg", "name":"nazriya"},
			 {"src":"../images/Bhavana wallpaper _1_.jpg", "name":"bhavana"},
			 {"src":"../images/29-mia-george.jpg", "name":"mia"},
			 {"src":"../images/Nazriya-Nazim2.jpg", "name":"nazriya"},
			 {"src":"../images/bhavana_41637-1600x1200.jpg", "name":"bhavana"},
			 {"src":"../images/mia george photos00-001.jpg", "name":"mia"},
			 {"src":"../images/nazriya-nazim-malayalam-actress-wallpapers_8.jpg", "name":"nazriya"},
			 {"src":"../images/bavana-this-of-bhavana-is-viewed-times-105673.jpg", "name":"bhavana"}];

	//$scope.storeImages = $scope.images;

	var i,num, length;
	$scope.previewId = $scope.images[0].src;
	$scope.prevImg = 0;
	$scope.nextImg = 0;
	$scope.delay=5000;

	//$scope.linkJson = '../json/album.json';

	/*$scope.loadedImages = function(data){
		$scope.images = data;
	}

	$scope.loadImages = function(){
		$http.get($scope.linkJson).success($scope.loadedImages)
	}*/

	var num, length;
	length = $scope.images.length;
	$scope.createIds = function(){
		for(i=0;i<length;i++){
			$scope.images[i]["id"] = i;
		}
		
	}
	$scope.createIds();



	$scope.addToContainer = function(i){
		num = parseInt(i.id);
		$scope.previewId= i.src;
		$scope.prevImg = num;
		$scope.nextImg = num;
	}
	
	//$scope.loadImages();

	$scope.prevImage = function(pnum){
		num = parseInt(pnum);
		if(num == 0){
			$scope.previewId= $scope.images[length-1].src;
			$scope.prevImg = length-1;
			$scope.nextImg = length-1;
		}else{
			$scope.previewId= $scope.images[parseInt(pnum)-1].src;
			$scope.prevImg = num-1;
			$scope.nextImg = num-1;
		}
	}

	$scope.nextImage = function(nnum){
		num = parseInt(nnum);
		if(num == (length-1)){
			$scope.previewId= $scope.images[0].src;
			$scope.prevImg = 0;
			$scope.nextImg = 0;	
		}else {
			$scope.previewId= $scope.images[parseInt(nnum)+1].src;
			$scope.prevImg = num+1;
			$scope.nextImg = num+1;
		}
	}

	/*$scope.reloadImages = function(s){
		$scope.images = $scope.storeImages;
		for(i=0;i<length;i++){
			if($scope.images[i]["name"] != s)
				$scope.images.splice(i,1);
			}
		}
		$scope.createIds();
	}
	*/

	$scope.autoNextImage = function(nnum){
		num = parseInt(nnum);
		if(num == (length-1)){
			$scope.$apply(function(){$scope.previewId= $scope.images[0].src;});
			$scope.prevImg = 0;
			$scope.nextImg = 0;	
		}else {
			$scope.$apply(function(){$scope.previewId= $scope.images[parseInt(nnum)+1].src;});
			$scope.prevImg = num+1;
			$scope.nextImg = num+1;
		}		
	}

	$scope.timeDelay = function(cusDelay){
		setInterval($scope.customNext,cusDelay);
	}

	$scope.customNext = function(){
		$scope.autoNextImage($scope.nextImg);
	}
	$scope.timeDelay($scope.delay);
}

