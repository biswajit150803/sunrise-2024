import type { NextApiRequest, NextApiResponse } from "next";
import {
  getActiveTasks,
  getCompletedTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/modules/taskManager";

type Data = {
  success: boolean;
  data?: any;
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  switch (req.method) {
    case "GET":
      handleGet(req, res);
      break;
    case "POST":
      handlePost(req, res);
      break;
    case "PUT":
      handlePut(req, res);
      break;
    case "DELETE":
      handleDelete(req, res);
      break;
    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

function handleGet(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { type } = req.query;

  switch (type) {
    case "active":
      res.status(200).json({ success: true, data: getActiveTasks() });
      break;
    case "completed":
      res.status(200).json({ success: true, data: getCompletedTasks() });
      break;
    case "all":
      res.status(200).json({ success: true, data: getAllTasks() });
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid query type" });
  }
}

function handlePost(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { title, description, persona, group } = req.body;

  if (title && description && persona && group) {
    createTask(title, description, persona, parseInt(group));
    res.status(201).json({ success: true, message: "Task created successfully" });
  } else {
    res.status(400).json({ success: false, message: "Missing required fields" });
  }
}

function handlePut(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id, ...updatedTask } = req.body;

  if (id) {
    updateTask(parseInt(id), updatedTask);
    res.status(200).json({ success: true, message: "Task updated successfully" });
  } else {
    res.status(400).json({ success: false, message: "Missing task ID" });
  }
}

function handleDelete(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  if (id) {
    deleteTask(parseInt(id as string));
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } else {
    res.status(400).json({ success: false, message: "Missing task ID" });
  }
}