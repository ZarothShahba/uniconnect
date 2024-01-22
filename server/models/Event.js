import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      default: "Title",
      type: String,
      required: true,
    },
    description: {
      default: "Description",
      type: String,
      required: true,
    },
    startDate: String,
    time: String,
    venue: String,
  },
  { timestamps: true }
);

const Events = mongoose.model("Events", eventSchema);
export default Events;
