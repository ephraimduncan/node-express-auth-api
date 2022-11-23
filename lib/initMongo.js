const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => console.log(e));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (error) => {
  console.log(error.message);
});

mongoose.connection.on("disconnected", (error) => {
  console.log("Mongoose disconnected from DB");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
