var appControllers=angular.module('app.controllers');

appControllers.controller('SearchController',function($scope,Helpers){
     $scope.search={"title":'',"link":'',"tags":'',"created_at":''};
     $scope.search={"title":'',"description":'',"link":'',"tags":'',"created_at":''};
     $scope.sortOrder={}; $scope.sortOrder.order='-created_at';

     $scope.searchQuestions=function(question){

       if($scope.search.title === '' && $scope.search.description === '' && $scope.search.link === ''
              && $scope.search.tags === '' && $scope.search.created_at === ''){
         return true;
       }
       else{

         if($scope.search.title !== '' && question.title.toLowerCase().indexOf($scope.search.title.toLowerCase()) !== -1){
             return true;
         }
         if($scope.search.description !== '' && question.description.toLowerCase().indexOf($scope.search.description.toLowerCase()) !== -1){
             return true;
         }
         if($scope.search.link !== '' && question.link.toLowerCase().indexOf($scope.search.link.toLowerCase()) !== -1){
             return true;
         }
         if($scope.search.created_at == null && $scope.search.description == '' && $scope.search.title == ''
               && $scope.search.link == '' && $scope.search.tags == '' ){
             return true;
         }
         if($scope.search.created_at !== '' && typeof($scope.search.created_at) !== 'undefined' && $scope.search.created_at !== null){
              return Helpers.compareDate(question.created_at,$scope.search.created_at.toISOString());
         }
         if($scope.search.tags !== ''){
            var searchTags=$scope.search.tags.toLowerCase().split(',');
            for(var i=0;i<searchTags.length;i++){
                  if(question.tags.indexOf(searchTags[i]) === -1){
                    return false;
                  }
            }
              return true;
         }
         return false;
       }
     }

     $scope.changeOrder=function(order){
       $scope.sortOrder.order=order;
     }

});
