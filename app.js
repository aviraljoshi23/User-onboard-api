const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const jsonValidator = require("./middleware/jsonValidator");
const setLanguage = require("./middleware/setLocales");
const apiRouter = require("./routes");
const connectDB = require("./config/db.config");

const app = express();

app.use(express.json());
app.use(setLanguage);
app.use(express.static(path.join(__dirname, "public")));
app.use(jsonValidator);
// Connect to the database
connectDB();
app.use("/api", apiRouter);
app.listen(process.env.PORT);
console.log("sever is listening port http://localhost:" + process.env.PORT);