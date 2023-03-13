import mongoose from "mongoose";
import { keys } from "../utils/config";

const connectDB = async () => await mongoose.connect(keys.MONGO_URI);

export default connectDB;
