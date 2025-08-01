const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://user1:aslkjdflaskdj@cluster0.gabjd5o.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
