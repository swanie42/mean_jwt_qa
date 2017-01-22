var appControllers=angular.module('app.controllers');
appControllers.controller('ListController',function(Storage,QuestionService,$scope,Helpers,$state,$modal,focus,toaster){

    $scope.showQuestions=function(){
      QuestionService.getQuestions().then(function(res){
          $scope.questions=res.data;
      });
    }

    $scope.showQuestions();

    $scope.showCreateQuestionModal=function(){
      $scope.questionModal=$modal({scope:$scope,show:true,controller:'QuestionController',
                                   templateUrl:'templates/create_question_modal.html'
                                   });
      }

    $scope.showCreateTagModal=function(){
      $scope.tagModal=$modal({scope:$scope,show:true,controller:'TagController',
                              placement:'center',templateUrl:'templates/create_tag_modal.html'});
      }

    $scope.showDeleteQuestionModal=function(question){
      $scope.questionToDelete=question;
      $scope.deleteQuestionModal=$modal({scope:$scope,show:true,placement:'center',controller:'QuestionController',
                                         templateUrl:'templates/delete_question_modal.html'});
     }
});
