import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

let getLastReceivedMessage: string | null = null;

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  // TODO implement the status route
  _user.get("/status", (req:any, res:any) => {
    res.send("live");
  });

  _user.post("/message", (req: any, res: any) => {
    const { message }: { message: string } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Missing message in request body" });
    }
    getLastReceivedMessage = message;
    res.json({ message: "Message received successfully" });
  });

  _user.get("/getLastReceivedMessage", (req: any, res: any) => {
    res.json({ result: getLastReceivedMessage})
  });

  let getLastSentMessage: string | null = null;

  _user.get("/getLastSentMessage", (req: any, res: any) => {
    res.json({ result: getLastSentMessage})
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}
