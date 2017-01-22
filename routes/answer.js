var mongoose = require( 'mongoose' );
var Answer = mongoose.model( 'Answer' );

exports.createAnswer=function(req,res){
   var newAnswer=new Answer();

   newAnswer.answer=req.body.text;
   newAnswer.created_by=req.body.created_by;
   newAnswer.createdAt=req.body.createdAt;
   newAnswer.votes=req.body.votes;

   newAnswer.save(function(err,savedAnswer){
       if(err){
         res.status(400).send('This answer already exist');
       }else{
         res.status(201).send({"answer":savedAnswer.answer});
       }
   });
}

exports.getAnswers=function(req,res){
   Answer.find({"created_by":req.query.created_by},function(err,answers){
     res.status(200).send(answers);
   })
};
