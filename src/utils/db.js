import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(`connect to ${process.env.MONGO} failed: `, error);
    throw new Error("Connection failed!");
  }
};

export default connect;
