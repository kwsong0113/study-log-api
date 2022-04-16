const express = require('express');

const { users, studyLogs } = require('../controllers');

const router = express.Router();

router.route('/')
.get((req, res) => res.status(200).send('SLog Server is Working'));

router.route("/users/:username")
.post(users.createUser);

router.route("/studylogs/:username")
.get(studyLogs.getStudyLogs)
.post(studyLogs.postStudyLog)
.delete(studyLogs.deleteStudyLog);

module.exports = router;