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
    })
    .catch(function(err) {
      console.log(err);
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
      var sortBy = e.srcElement.text;
      var nameSortEl = document.getElementsByClassName("name-sort");
      var bookSortEl = document.getElementsByClassName("book-sort");
      var nameClasses = "sort-item name-sort";
      var bookClasses = "sort-item book-sort";

      switch(sortBy){
        case "Name":
          if(nameSortEl[0].className.split(" ").indexOf("on") === -1){
            nameSortEl[0].className = nameSortEl[0].className + " on";
            bookSortEl[0].className = bookClasses;
          }

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
          if(bookSortEl[0].className.split(" ").indexOf("on") === -1){
            bookSortEl[0].className = bookSortEl[0].className + " on";
            nameSortEl[0].className = nameClasses;
          }

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
