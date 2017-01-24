var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var db=require('./models/db.js');
var routes = require("./routes");

var user=require('./routes/user.js');
var tag=require('./routes/tag.js');
var question=require('./routes/question.js');

var jwtSecret = 'kjwdjs65$ikksop0982shj';

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/','/signup','/login']}));

app.get('/',function(req,res){
   res.sendFile('index.html',{ root: __dirname });
});

app.post('/signup',user.signup);
app.post('/login',user.login,function(req,res){
    var token = jwt.sign({username: req.body.username}, jwtSecret);
    res.status(200).send({token: token,username: req.body.username});
});

app.post('/tag',tag.createTag);
app.get('/tags',tag.getTags);

app.use('/questions', routes);


// This was origionally here
// app.get('/question/:id',question.getQuestion);
// app.get('/questions',question.getQuestions);
// app.get('/my_questions',question.getMyQuestions);
//
// app.post('/question',question.addQuestion);
// app.put('/question/:id',question.updateQuestion);
// app.delete('/question/:id',question.deleteQuestion);

var port = process.env.PORT || 8080;
var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
