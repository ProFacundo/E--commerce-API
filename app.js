require("dotenv").config();
const connectDb = require("./db/connect");

require("express-async-errors");

const express = require("express");
const app = express();

//packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const authRoute = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { authenticateUser } = require("./middleware/authentication");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("home page");
});

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("home page");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", authenticateUser, orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
