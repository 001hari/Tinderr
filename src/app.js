require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const userRouter = require("./routes/userRouter");
const requestRouter = require("./routes/request");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173", // this should match your frontend URL
  credentials: true                // <-- this allows cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connected.... ");
    app.listen(process.env.PORT, () => {
      console.log(`Listing from server ${process.env.PORT} !!`);
    });
  })
  .catch((err) => {
    console.log("err.message");
  });
