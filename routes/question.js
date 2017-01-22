var mongoose = require('mongoose');
var Question = mongoose.model('Question');

exports.getQuestion = function(req, res) {
    Question.findOne({
        "_id": req.params.id
    }, function(err, question) {
        res.status(200).send(question);
    });
}

exports.addQuestion = function(req, res) {
    var newQuestion = new Question();
    newQuestion.title = req.body.title;
    newQuestion.link = req.body.link;
    newQuestion.description = req.body.description;
    newQuestion.tags = req.body.tags;
    newQuestion.answers = req.body.answers;
    newQuestion.created_by = req.body.created_by;
    newQuestion.save(function(err, savedQuestion) {
        if (err) {
            res.status(400).send('Error occurred while creating question');
        } else {
            res.status(201).send('Question created successfully');
        }
    });
}

exports.updateQuestion = function(req, res) {
    var id = req.params.id;
    Question.findOne({
            "_id": id
        },

        function(err, question) {
            if (err) {
                res.status(404).send("Error Occurred");
            } else {
                if (!question) {
                    res.status(404).send("No question found with id " + id);
                } else {
                    question.title = req.body.title;
                    question.link = req.body.link;
                    question.description = req.body.description;
                    question.tags = req.body.tags;
                    question.answers = req.body.answers;

                    question.save(function(err, updatedQuestion) {
                        if (err) {
                            res.status(500).send("Error Occurred while updating record");
                        } else {
                            res.status(200).send(updatedQuestion);
                        }
                    });
                }
            }
        });
}


exports.getQuestions = function(req, res) {
    Question.find({
        "created_by": req.query.created_by
    }, function(err, questions) {
        res.status(200).send(questions);
    });
}



exports.deleteQuestion = function(req, res) {
    var id = req.params.id;
    Question.findOneAndRemove({
            "_id": id
        },
        function(err) {
            if (err) {
                console.log("Error : " + err);
                return res.status(404).send("Question not found");
            }
            return res.status(200).send("Question deleted Successfully");
        });
}
