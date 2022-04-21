const dbo = require('./conn');
const { ObjectId } = require('mongodb');

const createUserDb = async (userData) => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');

  const userCheck = await users.findOne({ username: userData.username });
  if (userCheck) return { success: false };
  await users.insertOne({ ...userData, studyLogs: [], todos: [] });
  return { success: true };
}

const getUsersDb = async () => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');

  const userList = await users.find({}).toArray();
  return userList.map(({ email, username, studyLogs, geoip }) => ({ email, username, numStudyLogs: studyLogs.length, geoip }));
}

const setUserInfoDb = async (username, info) => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');
  
  const result = await users.updateOne({ username: username }, { $set: info });
  if (result.matchedCount !== 1) return { success: false };
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

const updateStudyLogDb = async (_id, { contents }) => {
  const dbConnect = dbo.getDb();
  const studyLogs = dbConnect.collection('studyLogs');
  const result = await studyLogs.updateOne({ _id: ObjectId(_id) }, { $set: { contents }});
  if (result.matchedCount !== 1) throw new Error('Failed to update the study log');
};

const addStudyLogDb = async (username, data) => {
  const {date: dateString, ...elseData} = data;
  const dateObject = new Date(dateString);
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');
  const studyLogs = dbConnect.collection('studyLogs');

  const user = await users.findOne({ username: username });
  const exists = await studyLogs.findOne({
    _id: {
      $in: user.studyLogs
    },
    date: dateObject
  });

  if (exists) throw new Error('Study log for the date already exists');

  const result = await studyLogs.insertOne({date: dateObject, ...elseData});
  await users.updateOne({ username: username }, { $push: { studyLogs: result.insertedId } });
};

const deleteStudyLogDb = async (username, _id) => {
  const dbConnect = dbo.getDb();
  const users = dbConnect.collection('users');
  const studyLogs = dbConnect.collection('studyLogs');
  const result = await studyLogs.deleteOne({ _id: ObjectId(_id) });

  if (result.deletedCount === 0) throw new Error('The study log does not exist');

  await users.updateOne({ username: username }, { $pull: { studyLogs: ObjectId(_id) } });
};

module.exports = { createUserDb, getUsersDb, setUserInfoDb, getStudyLogsDb, updateStudyLogDb, addStudyLogDb, deleteStudyLogDb };