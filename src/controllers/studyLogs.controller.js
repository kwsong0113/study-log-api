const { getStudyLogsDb, addStudyLogDb, updateStudyLogDb, deleteStudyLogDb } = require('../db');

const getStudyLogs = async (req, res) => {
  try {
    const response = await getStudyLogsDb(req.params.username);
    if (response.noUser) {
      res.sendStatus(404);
    } else {
      res.status(200).json(response);
    }
  } catch(err) {
    res.sendStatus(500);
  }
};

const postStudyLog = async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    if (_id) {
      await updateStudyLogDb(_id, data);
    } else {
      await addStudyLogDb(req.params.username, data);
    }
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(500);
  }
}

const deleteStudyLog = async (req, res) => {
  try {
    await deleteStudyLogDb(req.body._id);
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(500);
  }
}

module.exports = { getStudyLogs, postStudyLog, deleteStudyLog };