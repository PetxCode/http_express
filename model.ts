import { Document, Schema, model } from "mongoose";

interface iProps {
  task: string;
  avatar: string;
  started: boolean;
  done: boolean;
}

interface iPropsData extends iProps, Document {}

const taskModel = new Schema<iPropsData>(
  {
    task: {
      type: String,
    },
    avatar: {
      type: String,
    },
    started: {
      type: Boolean,
    },
    done: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default model("task", taskModel);
