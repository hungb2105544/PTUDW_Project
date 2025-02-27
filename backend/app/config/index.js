const app = require("../../app");

module.exports = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/BookStore",
  },
};
