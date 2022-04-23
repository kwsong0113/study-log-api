const { getTodosDb, postTodosDb } = require('../db');

const getTodos = async (req, res) => {
  try {
    const response = await getTodosDb(req.params.username);
    if (response.noUser) {
      res.sendStatus(404);
    } else {
      res.status(200).json(response);
    }
  } catch(err) {
    res.sendStatus(500);
  }
};

const postTodos = async (req, res) => {
  try {
    const { _id, notes } = req.body;
    await postTodosDb(_id, notes);
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(500);
  }
}

module.exports = { getTodos, postTodos };