const express = require('express');

const { users, studyLogs, todos } = require('../controllers');

const router = express.Router();

router.route('/')
.get((req, res) => res.status(200).send('SLog Server is Working'));

router.route("/users")
.get(users.getUsers);

router.route("/users/info/:username")
.post(users.setUserInfo);

router.route("/users/:username")
.post(users.createUser);

router.route("/studylogs/:username")
.get(studyLogs.getStudyLogs)
.post(studyLogs.postStudyLog)
.delete(studyLogs.deleteStudyLog);

router.route("/todos/:username")
.get(todos.getTodos)
.post(todos.postTodos)

module.exports = router;