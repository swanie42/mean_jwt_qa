var chalk = require('chalk');
var mongoose = require( 'mongoose' );
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10;

var dbURI = 'mongodb://localhost/test';
//var dbURI =process.env.dbURI
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error',function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
  console.log(chalk.red('Mongoose disconnected'));
});

var userSchema = new mongoose.Schema({
  username: {type: String, unique:true},
  email: {type: String, unique:true},
  password: String,
  created_at:{type:Date,default:Date.now}
});

var tagSchema = new mongoose.Schema({
  tag: {type: String},
  created_at:{type:Date,default:Date.now},
  created_by:String
});

tagSchema.index({ tag: 1, created_by: 1}, { unique: true });





// ================Q and A=============================
// var sortAnswers = function(a, b) {
//
// 	if(a.votes === b.votes){
// 		return b.updatedAt - a.updatedAt;
// 	}
// 	return b.votes - a.votes;
// }
//
// var answerSchema = new mongoose.Schema({
// 	text: String,
//     created_by:String,
// 	createdAt: {type: Date, default: Date.now},
// 	updatedAt: {type: Date, default: Date.now},
// 	votes: {type: Number, default:0}
// });
//
// answerSchema.method("update", function(updates, callback) {
// 	Object.assign(this, updates, {updatedAt: new Date()});
// 	this.parent().save(callback);
// });
//
// answerSchema.method("vote", function(vote, callback) {
// 	if(vote === "up") {
// 		this.votes += 1;
// 	} else {
// 		this.votes -= 1;
// 	}
// 	this.parent().save(callback);
// });
//
//
//
// var questionSchema = new mongoose.Schema({
//   title: String,
//   link: {type: String},
//   description: {type: String},
//   answers: [answerSchema],
//   tags: String,
//   created_at:{type:Date,default:Date.now},
//   created_by:String,
//
// });

// questionSchema.pre("save", function(next){
// 	this.answers.sort(sortAnswers);
// 	next();
// });

// =============================================


userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

mongoose.model('User', userSchema,'users' );
mongoose.model('Tag', tagSchema,'tags' );
// mongoose.model('Answer', answerSchema, 'answers' );
// mongoose.model('Question', questionSchema,'questions' );
