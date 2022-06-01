const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5001;
app.use(
  cors({
    origin: "https://gpt3chatbot1.surge.sh",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(require("./routes/user-responses"));
// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  console.log("a");
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
