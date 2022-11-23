const redis = require("redis");

const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
});

client.on("connect", () => {
  console.log("Client is connected to Redis");
});

client.on("ready", () => {
  console.log("Client is connected to Redis and ready to use");
});

client.on("error", (error) => {
  console.log(error);
});

client.on("end", () => {
  console.log("Client is disconnected from Redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
