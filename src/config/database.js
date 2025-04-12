const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://hari:H%40ri9876@tinderr.dwpusnq.mongodb.net/tinderr?retryWrites=true&w=majority&appName=Tinderr "
  );
};

module.exports = connectDB;
