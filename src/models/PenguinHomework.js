import mongoose from "mongoose";

const { Schema } = mongoose;

const penguinHomeworkSchema = new Schema(
  {
    title: {
      type: String
    },
    desc: {
      type: String
    },
    publicId: {
      type: String,
      unique: true,
    },
    secureUrl: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    improvementsURL: {
      type: String,
    },
  }, 
  { timestamps: true }
);

export default mongoose.models.PenguinHomework || mongoose.model("PenguinHomework", penguinHomeworkSchema);