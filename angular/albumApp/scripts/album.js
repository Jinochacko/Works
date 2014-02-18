function albumController ($scope){
	$scope.images = [{src:'../images/Mia George(5).jpg'},{src:'../images/Nazriya-Nazim1.jpg'},{src:'../images/Nazriya-Nazim2.jpg'},
			{src:'../images/Mia George(5).jpg'},{src:'../images/Nazriya-Nazim1.jpg'},{src:'../images/Nazriya-Nazim2.jpg'}];

	/*$scope.addToContainer = function () {
		$scope.selectedImage = ele.src;
	}*/
}

function addToContainer(ele){
	document.getElementById('selectedImage').src = ele.src;
}
