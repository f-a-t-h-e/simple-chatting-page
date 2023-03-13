import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   max: 50,
  // },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
});

const User = mongoose.model("Users", userSchema);

export default User;
