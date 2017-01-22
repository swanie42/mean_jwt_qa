var appControllers=angular.module('app.controllers');

appControllers.controller('EditController',function(TagService,$scope,QuestionService,Helpers,$stateParams,$state,$modal,CONSTANT,$http,focus,toaster){

    $scope.editQuestion={};         $scope.editTags=[];
    $scope.allTags=[];              $scope.editTagText={input:null};
    $scope.editQuestionMessage=null;

    QuestionService.getQuestion($stateParams.id)
    .then(function(response){
       $scope.editQuestion=response.data;
       $scope.editQuestion.inputTags=response.data.tags.split(',').sort();
       if($scope.editQuestion.inputTags.length ==8){
         $scope.showEditTagField=false;
       }else{
         $scope.showEditTagField=true;
       }
    });


    $scope.loadTags=function(){
      TagService.getTags()
      .then(function(response){
          $scope.allTags=response.data.map(function(element){return element.tag;}).sort();
          $scope.editTags=getSuggestionTags($scope.allTags,$scope.editQuestion.inputTags);
          $scope.editTags.sort();
      });
    }

    $scope.loadTags();

    $scope.removeEditTag=function(tag){
      $scope.editQuestion.inputTags.splice($scope.editQuestion.inputTags.indexOf(tag),1);
      $scope.editTags.push(tag);   $scope.editTags.sort();
      if($scope.editQuestion.inputTags.length < 8){$scope.showEditTagField=true;}
      focus('editQuestionTagsInput');
    }

    $scope.selectEditTag=function(tag){
      $scope.editQuestion.inputTags.push(tag);
      $scope.editTags.splice($scope.editTags.indexOf(tag),1);  $scope.editTags.sort();
      $scope.editTagText.input=null;
      if($scope.editQuestion.inputTags.length >= 8){$scope.showEditTagField=false;}
      focus('editQuestionTagsInput');
    }

    $scope.updateQuestion=function(question){
      $scope.editQuestionMessage=null;
      console.log("Question "+JSON.stringify(question));
       if(Helpers.undefined_or_empty(question.title)){$scope.editQuestionMessage='Nay! looks like you forgot question title'; return;}
       if(Helpers.undefined_or_empty(question.link)){$scope.editQuestionMessage='Nay! looks like you forgot question link'; return;}
       if(Helpers.undefined_or_empty(question.description)){$scope.editQuestionMessage='Please fill in question description'; return;}
       if(question.inputTags.length < 1){$scope.editQuestionMessage='Nay! we need at least one tag for question'; return;}
       var comma_separated_tags=Helpers.commaSeparatedTags(question.inputTags);
       var request_body={"title":question.title,"link":question.link,"description":question.description,"tags":comma_separated_tags};
       QuestionService.updateQuestion($stateParams.id,request_body)
       .then(function(response){
               toaster.pop('success','Question updated successfully');
               setTimeout(function(){$state.go('list');},2000);
            },
            function(error){ console.log("Error while updating question"); }
          );
    }

    $scope.$on('newTagAdded', function(event, data){
      focus('editQuestionTagsInput');
      $scope.loadTags();
    });

    $scope.cancelUpdate=function(){
           $state.go('list');
    }

    $scope.showCreateEditTagModal=function(){
      $scope.tagModal=$modal({scope:$scope,show:true,placement:'center',
                              controller:'TagController',templateUrl:'templates/create_tag_modal.html'});
      $scope.editTagText.input=null;
    }

});

function getSuggestionTags(allTags,questionTags ) {
  return allTags.filter(function (tag) {
      return questionTags.indexOf(tag) == -1;
  });
}
