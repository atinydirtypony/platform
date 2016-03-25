//this is the javascript for digesting the other page

app= angular.module("PlatformApp", []);

app.controller("EmulatorController", ["$scope", "$http", function($scope,$http){
    $scope.targetURL

    $scope.submitURL = function(){
        console.log($scope.targetURL)
    }


    var getLayout = function(callFinish){
        $http.get("/layout").success(function(data){callFinish(data.data)});
    }

    var getLayoutFinish = function(stage){
       return function(data){ drawAllRectangles(filterElements(data), stage)};
    }

    var filterElements = function(elementArray){
        return elementArray.filter(IsVisibleTag)
    }

    var IsVisibleTag =function(domInfoObject){
       return domInfoObject.type != "DIV" && domInfoObject.type !="SPAN" && domInfoObject.type !="SCRIPT"
    }

    var drawAllRectangles = function(elementArray, stage){
        for(index in elementArray){
            var temp_rectangle= drawDOMRectangle(elementArray[index]);
            stage.addChild(temp_rectangle);
        }
        stage.update();
    }

    var drawDOMRectangle = function(domInfoObject){
        var rectangle = new createjs.Shape();
        rectangle.graphics.setStrokeStyle(1).beginStroke("black").drawRect(domInfoObject.position.left, domInfoObject.position.top,domInfoObject.width,domInfoObject.height);
        return rectangle;
    }


    var rect_obj={
        position:{
            left: 10,
            top:20
        },
        width:20,
        height:20
    }

    $scope.init=function() {
        var stage = new createjs.Stage("demoCanvas");

        getLayout(getLayoutFinish(stage));

        stage.update();
    }





}]);






