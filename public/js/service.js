var appService=angular.module('app.service',[]);

appService.service('Helpers',function(){
     return {
        'compareDate' :  function(questionDate,search){
                            var question_date=new Date(questionDate);
                            var search_criteria=new Date(search);

                            if(question_date.getDate() == search_criteria.getDate()
                              && question_date.getMonth() == search_criteria.getMonth()
                              && question_date.getFullYear() == search_criteria.getFullYear()){
                                return true;
                              }
                              else{
                                return false;
                              }
                            },
        'extractDate' :  function(isoDate){
                            var date=new Date(isoDate);
                            var day=date.getDate();
                            var month=date.getMonth()+1;
                            var year=date.getFullYear();
                            console.log("Extracted date "+day+"-"+month+"-"+year);
                            return day+"-"+month+"-"+year;
                          } ,
        'checkTagName' : function(tagName){
                            if(/^[a-zA-Z-]+$/.test(tagName)){
                                console.log("Tag Name Valid");
                                return true;
                              }else{
                                console.log("Tag Name Invalid");
                                return false;
                              }
                            },

       'commaSeparatedTags'  :   function(tagsArray){
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
                                  },

        'undefined_or_empty' :   function (value){
                                    if(typeof value == 'undefined' || value == '' ){
                                          return true;
                                        }else{
                                          return false;
                                        }
                                  }

     }
});


appService.service('Storage',function($window){
  var store = $window.localStorage;
      return{
            getUsername: getUsername,
            setUsername: setUsername,
            remove:remove,
            save:save
      };
    function getUsername() {
      return store.getItem('username');
    }
    function setUsername(username) {
      return store.setItem('username',username);
    }
    function remove(key){
      return store.removeItem(key);
    }
    function save(key,value){
      return store.setItem(key,value);
    }

});

appService.service('AuthService',function($window){
     return{
       isLoggedIn:isLoggedIn
     };
     function isLoggedIn(){
       if($window.localStorage.getItem('loggedIn')){
         return true;
       }else{
         console.log("User is not logged in");
         return false;
       }
     }
});


appService.service('QuestionService',function($http,CONSTANT,Storage){
   this.getQuestion = function(_id) {
       return $http.get(CONSTANT.API_URL+'/questions/'+_id);
     };

   this.getQuestions = function() {
        return $http.get(CONSTANT.API_URL+'/questions?created_by='+Storage.getUsername());
      };

   this.createQuestion = function(question) {
        return $http.post(CONSTANT.API_URL+'/questions',question,{headers:{"Content-Type":"application/json"}});
      };

   this.deleteQuestion = function(_id){
     return $http.delete(CONSTANT.API_URL+'/questions/'+_id);
   };

   this.updateQuestion = function(_id,question){
     return $http.post(CONSTANT.API_URL+'/questions/'+_id,question,{headers:{"Content-Type":"application/json"}});
   }
});

appService.service('AnswerService',function($http,CONSTANT,Storage){
   // this.getAnswer = function(_id, aID) {
   //     return $http.get(CONSTANT.API_URL+'/questions/'+_id'/answer/'+_id);
   //   };

   // this.getAnswers = function() {
   //      return $http.get(CONSTANT.API_URL+'/questions?created_by='+Storage.getUsername());
   //    };
   // this.getAnswers = function(_id) {
   //     return $http.get(CONSTANT.API_URL+'/questions/'+_id'/answers';
   //   };

   this.createAnswer = function(_id,answer) {
        return $http.post(CONSTANT.API_URL+'/questions/'+_id+'/answers',answer,{headers:{"Content-Type":"application/json"}});
    };


   // this.deleteQuestion = function(_id){
   //   return $http.delete(CONSTANT.API_URL+'/question/'+_id);
   // };
   //
   // this.updateQuestion = function(_id,question){
   //   return $http.put(CONSTANT.API_URL+'/question/'+_id,question,{headers:{"Content-Type":"application/json"}});
   // }
});


appService.service('TagService',function($http,CONSTANT,Storage){
   this.getTags = function(){
     return $http.get(CONSTANT.API_URL+'/tags?created_by='+Storage.getUsername());
   };

   this.createTag = function(tag){
     return $http.post(CONSTANT.API_URL+'/tag',tag,{headers:{'Content-Type': 'application/json'}});
   };
});

appService.service('UserService',function($http,CONSTANT,Storage){

      this.signup = function(user){
        return $http.post(CONSTANT.API_URL+'/signup',user,{headers:{'Content-Type': 'application/json'}});
      };

      this.login = function(user){
        return $http.post(CONSTANT.API_URL+'/login',user,{headers:{'Content-Type': 'application/json'}});
      };

      this.logout = function(){
         Storage.remove('auth-token');
         Storage.remove('username');
         Storage.remove('loggedIn');
      };
});
