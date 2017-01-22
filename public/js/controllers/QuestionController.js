var appControllers=angular.module('app.controllers');

appControllers.controller('QuestionController',function(QuestionService,TagService,Storage,focus,$scope,CONSTANT,Helpers,toaster,$state){
    $scope.question={};
    $scope.question.inputTags=[];
    $scope.tags=[];
    $scope.questionMessage=null;
    $scope.tagText={input:null};
    $scope.showInputTagField=true;

    $scope.loadTags=function(){
      TagService.getTags()
        .then(function(response){
                      $scope.tags=response.data.map(function(element){
                                        if($scope.question.inputTags.indexOf(element.tag)==-1){
                                          return element.tag;
                                        }
                                      }).sort();
            });
     }
    $scope.loadTags();

    $scope.$on('newTagAdded', function(event, data){
      $scope.tagText.input=null;
      focus('questionTagsInput');
      $scope.loadTags();
    });

  $scope.selectTag=function(tag){
    $scope.question.inputTags.push(tag); $scope.tags.splice($scope.tags.indexOf(tag),1)
    $scope.tags.sort(); $scope.tagText.input=null;
    if($scope.question.inputTags.length >= 8){$scope.showInputTagField=false;}
    focus('questionTagsInput');
  }

  $scope.removeTag=function(tag){
    console.log("Removing Tag "+tag);
    $scope.question.inputTags.splice($scope.question.inputTags.indexOf(tag),1);
    $scope.tags.push(tag);
    $scope.tags.sort();
    if($scope.question.inputTags.length < 8){$scope.showInputTagField=true;}
    focus('questionTagsInput');
  }

  $scope.createQuestion=function(question){
    $scope.questionMessage=null;
     if(Helpers.undefined_or_empty(question.title)){$scope.questionMessage='Nay! looks like you forgot question title'; return;}
     if(Helpers.undefined_or_empty(question.link)){$scope.questionMessage='Nay! looks like you forgot question link'; return;}
     if(Helpers.undefined_or_empty(question.description)){$scope.questionMessage='Please fill in question description'; return;}
     if(question.inputTags.length < 1){$scope.questionMessage='Nay! we need at least one tag for question'; return;}
     var comma_separated_tags=Helpers.commaSeparatedTags(question.inputTags);
     var post_body={"title":question.title,"link":question.link,"description":question.description,"tags":comma_separated_tags,
                       "created_at":Date.now().toString(),"created_by":Storage.getUsername()};

     QuestionService.createQuestion(post_body)
     .then(function(response){
             toaster.pop('success','Question created successfully');
             setTimeout(function(){$scope.questionModal.hide();$scope.showQuestions();},2000);
          },
          function(error){console.log("Error while creating question"); }
        );
  }

  $scope.deleteQuestion=function(_id){
      QuestionService.deleteQuestion(_id)
         .then(function(response){
                $scope.deleteQuestionModal.hide();
                toaster.pop("success","Question deleted successfully");
                setTimeout(function(){$scope.showQuestions();},2000);
              });
   }

});
