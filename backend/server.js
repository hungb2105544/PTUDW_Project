const app = require("./app");
const config = require("./app/config/index");
const mongoose = require("mongoose");

async function startServe() {
  try {
    console.log(config.db);
    await mongoose.connect(config.db.uri);
    console.log("Connected to database");
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log("Loi gap phai : ", e);
    console.log("Can not connect to database");
    process.exit();
  }
}

startServe();
