const dbo = require('./conn');
const { ObjectId } = require('mongodb');

const createUserDb = async (userData) => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');

  const userCheck = await users.findOne({ username: userData.username });
  if (userCheck) return { success: false };
  await users.insertOne({ ...userData, subjects: {}, studyLogs: [], todos: [] });
  return { success: true };
}

const getStudyLogsDb = async (username) => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');
  const studyLogs = dbConnect.collection('studyLogs');

  const user = await users.findOne({ username: username });
  if (user?.studyLogs) {
    return await studyLogs.find({
      _id: {
        $in: user.studyLogs
      }
    }).sort({ date: 1 }).toArray();
  } else {
    return { noUser: true };
  }
}

const updateStudyLogDb = async (_id, data) => {
  const dbConnect = dbo.getDb();
  const studyLogs = dbConnect.collection('studyLogs');
  await studyLogs.updateOne({ _id: ObjectId(_id) }, { $set: data });
};

const addStudyLogDb = async (username, data) => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');
  const studyLogs = dbConnect.collection('studyLogs');
  const result = await studyLogs.insertOne(data);

  const subjectDict = {};
  for (const { subjects } of data.contents) {
    for (subject of subjects) {
      subjectDict[subject] = (subjectDict[subjectDict] || 0) + 1;
    }
  }

  await users.updateOne({ username: username }, { $push: { studyLogs: result.insertedId, $inc: { subjects: subjectDict } } });
};

const deleteStudyLogDb = async (username, _id) => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');
  const studyLogs = dbConnect.collection('studyLogs');
  await studyLogs.deleteOne({ _id: ObjectId(_id) });
  await users.updateOne({ username: username }, { $pull: { studyLogs: ObjectId(_id) } });
};

module.exports = { createUserDb, getStudyLogsDb, updateStudyLogDb, addStudyLogDb, deleteStudyLogDb };