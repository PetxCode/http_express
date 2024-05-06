import express, { Application, Request, Response } from "express";
import { Schema, connect, model } from "mongoose";
// import taskModel from "./model";

import cors from "cors";
const url: string = "mongodb://127.0.0.1:27017/learningDB";

interface iProps {
  task: string;
  avatar: string;
  started: boolean;
  done: boolean;
}

interface iPropsData extends iProps, Document {}

const taskModel = model<iPropsData>(
  "task",
  new Schema(
    {
      task: {
        type: String,
      },
      avatar: {
        type: String,
      },
      started: {
        type: Boolean,
        default: false,
      },
      done: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

const port: number = 9911;
const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PATCH"] }));

app.get("/api/get", async (req: Request, res: Response): Promise<Response> => {
  try {
    const getData = await taskModel.find();

    return res.status(200).json({
      message: "This is the EndPoint",
      status: 200,
      data: getData,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "EndPoint cannot be found",
      data: error.message,
      status: 404,
    });
  }
});

app.post(
  "/api/create",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { task, avatar } = req.body;
      const getData = await taskModel.create({ task, avatar });
      return res.status(200).json({
        message: "This is the EndPoint",
        status: 200,
        data: getData,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "EndPoint cannot be found",
        data: error.message,
        status: 404,
      });
    }
  }
);

app.delete(
  "/api/delete/:taskID",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { taskID } = req.params;
      console.log();
      const getData = await taskModel.findByIdAndDelete(taskID);
      return res.status(200).json({
        message: "This is the EndPoint",
        status: 200,
        data: getData,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "EndPoint cannot be found",
        data: error.message,
        status: 404,
      });
    }
  }
);

app.patch(
  "/api/update/:taskID",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { taskID } = req.params;
      console.log();
      const getData = await taskModel.findByIdAndUpdate(
        taskID,
        { started: true },
        { new: true }
      );
      return res.status(200).json({
        message: "This is the EndPoint",
        status: 200,
        data: getData,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: "EndPoint cannot be found",
        data: error.message,
        status: 404,
      });
    }
  }
);

app.listen(port, async () => {
  await connect(url)
    .then(() => {
      console.log("connected ❤️❤️❤️❤️");
    })
    .catch((err) => console.error(err));
});
