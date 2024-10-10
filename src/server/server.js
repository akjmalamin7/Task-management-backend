const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("../../app");
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection failed!", err));
app.listen(PORT, () => {
  console.log(`Server is running on port:http://127.0.0.1:${PORT}`);
});
