import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.culfh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log("Successfully Connected to the Database");
  } catch (error) {
    console.log("Failed to Connect to the database", error);
  }
};
export default dbConnection;
