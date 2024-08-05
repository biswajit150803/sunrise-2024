import {
    completeTask,
} from "@/modules/taskManager";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    success: boolean;
    message?: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { title } = req.body;
    completeTask(title);
    res.status(200).json({ success: true });
}