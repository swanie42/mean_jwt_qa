var appControllers=angular.module('app.controllers');


appControllers.controller('ListController',function($scope,$window,$state,$modal,CONSTANT,$http,focus,toaster){

   console.log("LoggedIn "+$window.localStorage.getItem('loggedIn'));
   //var loggedIn=
    if($window.localStorage.getItem('loggedIn') !== 'true'){
      $state.go('login');
    }

    console.log("List Controller is all hooked up");



    $scope.search={"description":'',"link":'',"tags":'',"created_at":''};
    $scope.sortOrder={};
    $scope.sortOrder.order='-created_at';
    $scope.bookmark={};
    $scope.newTag={};
    $scope.tagMessage=null;
    $scope.bookmark.inputTags=[];
    $scope.tags=[];
    $scope.tagText={input:null};
    $scope.tagInputFocus=false;
    $scope.showInputTagField=true;
    $scope.bookmarkMessage=null;

    $scope.changeOrder=function(order){
      console.log("Changing Order to "+order)
      $scope.sortOrder.order=order;
    }

    $scope.searchBookmarks=function(bookmark){



      if($scope.search.description === '' && $scope.search.link === ''
         && $scope.search.tags === '' && $scope.search.created_at === ''){
        return true;
      }
      else{

        if($scope.search.description !== '' && bookmark.description.toLowerCase().indexOf($scope.search.description.toLowerCase()) !== -1){
           console.log("Searching _ Description");
           return true;
        }
        if($scope.search.link !== '' && bookmark.link.toLowerCase().indexOf($scope.search.link.toLowerCase()) !== -1){
           console.log("Searching _ Link");
           return true;
        }

        if($scope.search.created_at == null && $scope.search.description == ''
           && $scope.search.link == '' && $scope.search.tags == '' ){
          return true;
        }

        if($scope.search.created_at !== '' && typeof($scope.search.created_at) !== 'undefined' && $scope.search.created_at !== null){
          // console.log(bookmark.created_at +"   "+$scope.search.created_at.toISOString()  )
           //extractDate($scope.search.created_at.toISOString())
           //extractDate(bookmark.created_at)
            /*  if($scope.search.created_at === bookmark.created_at){
                console.log("Time matched");
                return true;
              }else{
                console.log("Time didn't matched");
              }*/
              return compareDate(bookmark.created_at,$scope.search.created_at.toISOString());
        }


        if($scope.search.tags !== ''){
           console.log("Searching _ Tags");
           var searchTags=$scope.search.tags.toLowerCase().split(',');
           for(var i=0;i<searchTags.length;i++){
                 if(bookmark.tags.indexOf(searchTags[i]) === -1){
                   return false;
                 }
           }
             return true;
        }



        return false;

      }

    }

    $scope.showCreateBookmarkModal=function(){
      var cacheBurst=Date.now();
      $scope.bookmarkModal=$modal({scope:$scope,show:true,
                                   templateUrl:'templates/create_bookmark_modal.html?n='+cacheBurst
                                   });
      $scope.bookmark={};
      $scope.newTag={};
      $scope.tagMessage=null;
      $scope.bookmark.inputTags=[];
      $scope.tags=[];
      $scope.tagText={input:null};
      $scope.tagInputFocus=false;
      $scope.showInputTagField=true;
      $scope.loadTags();
      $scope.bookmarkMessage=null;
    }

    $scope.removeTag=function(tag){
      console.log("Removing Tag "+tag);
      $scope.bookmark.inputTags.splice($scope.bookmark.inputTags.indexOf(tag),1);
      $scope.tags.push(tag);
      $scope.tags.sort();
      if($scope.bookmark.inputTags.length < 8){$scope.showInputTagField=true;}
      focus('bookmarkTagsInput');
    }

    $scope.loadTags=function(){
      console.log("Loading tags from database");
      $http.get(CONSTANT.API_URL+'/tags')
      .then(function(response){
          console.log(JSON.stringify(response.data));
          $scope.tags=response.data.map(function(element){return element.tag;}).sort();
          //console.log("Sorted Tags "+response.data.map(function(element){return element.tag;}).sort())
      });
    }

    $scope.selectTag=function(tag){
      console.log("Selecting Tag "+ tag)
      $scope.bookmark.inputTags.push(tag);
      $scope.tags.splice($scope.tags.indexOf(tag),1)
      $scope.tags.sort();
      console.log("Emptying tag input field");
      $scope.tagText.input=null;
      if($scope.bookmark.inputTags.length >= 8){$scope.showInputTagField=false;}
      focus('bookmarkTagsInput');
    }

    $scope.showCreateTagModal=function(){
      $scope.newTag={};
      $scope.tagMessage=null;
      $scope.tagModal=$modal({scope:$scope,show:true,placement:'center',templateUrl:'templates/create_tag_modal.html'});
      $scope.tagText.input=null;
    }

    $scope.createTag=function(tag){
      $scope.tagMessage=null;
      if(undefined_or_empty(tag.name)){
        $scope.tagMessage='Nay! looks like you forgot to name your tag';return;
      }
      if(!checkTagName(tag.name)){
        $scope.tagMessage='Oh! only alphabets(a-z) and hypen(-) can be used as tag name';
        return;
      }
      console.log("Creating a new tag "+tag.name);
      var request_body={"name":tag.name.trim().toLowerCase()};
      $http.post(CONSTANT.API_URL+'/tag',request_body,{headers:{'Content-Type': 'application/json'}})
      .then(function(response){
             console.log("Successfully created "+response.data);
             //$scope.tagMessage="Tag "+response.data.tag+" created successfully";
             toaster.pop('success','Tag created successfully');
             $scope.loadTags();
             setTimeout(function(){$scope.tagModal.hide();},2000);
           }
           ,function(error){
             console.log("Error "+error);
             $scope.tagMessage="A tag with this name already exist";
           });
    }

    $scope.createBookmark=function(bookmark){
      $scope.bookmarkMessage=null;
      console.log("Bookmark "+JSON.stringify(bookmark));
       if(undefined_or_empty(bookmark.link)){$scope.bookmarkMessage='Nay! looks like you forgot bookmark link'; return;}
       if(undefined_or_empty(bookmark.description)){$scope.bookmarkMessage='Please fill in bookmark description'; return;}
       if(bookmark.inputTags.length < 1){$scope.bookmarkMessage='Nay! we need at least one tag for bookmark'; return;}
       var comma_separated_tags=commaSeparatedTags(bookmark.inputTags);
       console.log("TIME IS "+Date.now().toString());
       var request_body={"link":bookmark.link,"description":bookmark.description,"tags":comma_separated_tags,
                         "created_at":Date.now().toString()};
       $http.post(CONSTANT.API_URL+'/bookmark',request_body,{headers:{"Content-Type":"application/json"}})
       .then(function(response){
               console.log("Bookmark created successfully");
               toaster.pop('success','Bookmark created successfully');
               setTimeout(function(){$scope.bookmarkModal.hide();$scope.showBookmarks();},2000);
            },
            function(error){
               console.log("Error while creating bookmark");
            }
          );
    }

    $scope.showBookmarks=function(){
      $http.get(CONSTANT.API_URL+'/bookmarks')
      .then(function(res){
        $scope.bookmarks=res.data;
      })
    }

    $scope.showBookmarks();

    $scope.showDeleteBookmarkModal=function(bookmark){
      $scope.bookmarkToDelete=bookmark;
      $scope.deleteBookmarkModal=$modal({scope:$scope,show:true,placement:'center',
                              templateUrl:'templates/delete_bookmark_modal.html'});
    }

    $scope.deleteBookmark=function(){
      $scope.deleteBookmarkModal.hide();
      $http.delete(CONSTANT.API_URL+'/bookmark/' + $scope.bookmarkToDelete._id)
           .then(function(response){
              $scope.bookmarkToDelete=null;
              toaster.pop("success","Bookmark deleted successfully");
              setTimeout(function(){$scope.showBookmarks();},2000);
           });
    }

});



function undefined_or_empty(value){
  if(typeof value == 'undefined' || value == '' ){
    return true;
  }else{
    return false;
  }
}

function commaSeparatedTags(tagsArray){
  var size=tagsArray.length;
  var commaSeparatedTags='';
  for(var i=0;i<size;i++){
    if(i < size-1){
      commaSeparatedTags +=tagsArray[i]+',';
    }else{
      commaSeparatedTags +=tagsArray[i];
    }
  }
  return commaSeparatedTags;
}

function checkTagName(tagName){
   if(/^[a-zA-Z-]+$/.test(tagName)){
     console.log("Tag Name Valid");
     return true;
   }else{
     console.log("Tag Name Invalid");
     return false;
   }
}

function extractDate(isoDate){
  var date=new Date(isoDate);
  var day=date.getDate();
  var month=date.getMonth()+1;
  var year=date.getFullYear();
  console.log("Extracted date "+day+"-"+month+"-"+year);
  return day+"-"+month+"-"+year;
}


function compareDate(bookmarkDate,search){
  var bookmark_date=new Date(bookmarkDate);
  var search_criteria=new Date(search);

  if(bookmark_date.getDate() == search_criteria.getDate()
     && bookmark_date.getMonth() == search_criteria.getMonth()
     && bookmark_date.getFullYear() == search_criteria.getFullYear()){
       return true;
     }else{
       return false;
     }
}
