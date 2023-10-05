import mongoose from "mongoose";

const { Schema } = mongoose;

const penguinHomeworkSchema = new Schema(
  {
    publicId: {
      type: String,
      unique: true,
      required: true,
    },
    secureUrl: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false
    },
    improvementsURL: {
      type: String,
    },
  }, 
  { timestamps: true }
);

export default mongoose.models.PenguinHomework || mongoose.model("PenguinHomework", penguinHomeworkSchema);