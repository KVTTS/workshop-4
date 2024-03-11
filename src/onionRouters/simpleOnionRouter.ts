import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT } from "../config";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  // TODO implement the status route
  onionRouter.get("/status", (req:any, res:any) => {
    res.send("live");
  });

  let getLastReceivedEncryptedMessage: string | null = null;

  onionRouter.get("/getLastReceivedEncryptedMessage", (req: any, res: any) => {
    res.json({ result: getLastReceivedEncryptedMessage})
  });

  let getLastReceivedDecryptedMessage: string | null = null;

  onionRouter.get("/getLastReceivedDecryptedMessage", (req: any, res: any) => {
    res.json({ result: getLastReceivedDecryptedMessage})
  });

  let getLastMessageDestination: string | null = null;

  onionRouter.get("/getLastMessageDestination", (req: any, res: any) => {
    res.json({ result: getLastMessageDestination})
  });

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
