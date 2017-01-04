angular.module("app", [])
  .controller("AppCtrl", ["$rootScope", "$scope", "$http", "changeData", "filterFunc", function($rootScope, $scope, $http, changeData, filterFunc) {
    
    $rootScope.largestValue = 0;
    $rootScope.content = ["Loading..."];
    $scope.selectSortOption = filterFunc.filterFunc;

    $http({
      method: "GET",
      url: "https://api.myjson.com/bins/ho58r%E2%80%8B"
    })
    .then(function(data) {
      var updatedData = changeData.manipulateData(data.data);
      $rootScope.content = updatedData.result;
    });

  }])
  .factory("changeData", function() {

    var manipulateData = function(data) {
      var result = [];
      var largestValue = 0;

      for(var key in data){
        if(data[key] > largestValue) largestValue = data[key];

        var tempObj = {};
        tempObj.name = key;
        tempObj.value = data[key];

        result.push(tempObj);
      }

      result = result.map(function(book) {
        var percent = book.value / largestValue * 100;

        percent = percent + "%";
        book.style = {"width": percent};

        return book;
      });

      return {
        result: result
      };
    };

    return {
      manipulateData : manipulateData    
    };

  })
  .factory("filterFunc", function($rootScope) {

    var filterBy = function(e) {
      var value, i, j;
      $rootScope.sortElement = e;
      $rootScope.elementClasses = $rootScope.sortElement.srcElement.className;
      $rootScope.sortBy = $rootScope.sortElement.srcElement.text;

      // update style of buttons clicked
      // $rootScope.elementClasses = $rootScope.elementClasses + " selected";

      switch($rootScope.sortBy){
        case "Names":
          for(i=0; i<$rootScope.content.length; i++){
            value = $rootScope.content[i];
            j = i - 1;

            for(; j >= 0 && $rootScope.content[j].name > value.name; j--){
              $rootScope.content[j + 1] = $rootScope.content[j];
            }

            $rootScope.content[j + 1] = value;
          }

          return;
        case "Books":
          for(i=0; i<$rootScope.content.length; i++){
            value = $rootScope.content[i];
            j = i - 1;

            for(; j >= 0 && $rootScope.content[j].value > value.value; j--){
              $rootScope.content[j + 1] = $rootScope.content[j];
            }

            $rootScope.content[j + 1] = value;
          }

          return;
        default:
          return;
      }
    };

    return {
      filterFunc: filterBy
    };
  });
