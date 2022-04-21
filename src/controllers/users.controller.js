const { createUserDb, getUsersDb } = require('../db');

const createUser = async (req, res) => {
  try {
    const response = await createUserDb(req.body);
    if (response.success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await getUsersDb();
    res.status(200).json(response);
  } catch (err) {
    res.sendStatus(500);
  }
}

module.exports = { createUser, getUsers };