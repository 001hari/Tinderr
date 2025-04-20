const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const userRouter = require("./routes/userRouter");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected.... ");
    app.listen(3000, () => {
      console.log("Listing from server 3000 !!");
    });
  })
  .catch((err) => {
    console.log("unsu");
  });
