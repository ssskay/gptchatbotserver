const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const routes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you create a new record.
routes.route("/user-responses/add").post(async (req, response) => {
  let db_connect = dbo.getDb();
  let myobj = {
    userId: req.body.userId,
    user_response: req.body.userResponse,
  };
  db_connect.collection("user_responses").insertOne(myobj, async (err, res) => {
    if (err) throw err;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const responses = (
      await openai.createCompletion("text-davinci-002", {
        prompt: "Human:" + myobj.user_response + ".Chatbot:",
        temperature: 1,
        max_tokens: 60,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0,
        n: 3,
      })
    ).data.choices.map((choice) => choice.text);

    console.log(responses);
   
    response.json({ responses: responses, _id: res.ops[0]._id });
  });
});

module.exports = routes;
