const express = require("express");
const connectDb = require("./config/database.js");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const authRouter = require("./routes/auth.js");

const profileRouter = require("./routes/profile.js");

const requestRouter = require("./routes/request.js");

const userRouter = require("./routes/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("connected to the mongoose db!!!");
    app.listen(3000, () => {
      console.log("my server is up and running successfully!!");
    });
  })
  .catch((err) => {
    console.log("we have go an error while connecting to the db: \n", err);
  });
