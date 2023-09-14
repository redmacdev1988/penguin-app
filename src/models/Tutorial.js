import mongoose from "mongoose";

const { Schema } = mongoose;

const tutorialSchema = new Schema(
  {
    tutorialId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    categories: {
      type: [{type: Number}], 
      required: false,
    },
  },
  { timestamps: true }
);

//If the Tutorial collection does not exist create a new one.
export default mongoose.models.Tutorial || mongoose.model("Tutorial", tutorialSchema);
