var appControllers=angular.module('app.controllers');

appControllers.controller('AnswerController',function(TagService,$scope,QuestionService,AnswerService,Helpers,$stateParams,$state,$modal,CONSTANT,$http,focus,toaster){

    $scope.editQuestion={};
    $scope.answer={};


    QuestionService.getQuestion($stateParams.id)
    .then(function(response){
       $scope.editQuestion=response.data;
    });

    $scope.createAnswer=function(answer){
        console.log("this is the answer submission", answer.text);

       var post_body={"text":answer.text,"created_at":Date.now().toString()};

       AnswerService.createAnswer(post_body)
       .then(function(response){

               toaster.pop('success','Answer created successfully');
            },
            function(error){console.log("Error while creating answer"); }
          );
    }

    // $scope.cancelAnswer=function(){
    //        $state.go('list');
    // }



});
