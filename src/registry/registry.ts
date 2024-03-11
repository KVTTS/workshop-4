import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string };

export type GetNodeRegistryBody = {
  nodes: Node[];
};


export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());

  let registeredNodes: Node[] = [];
  
  function getNodeRegistry(req: Request, res: Response<GetNodeRegistryBody>) {
    return res.json({
      nodes: Array.from(registeredNodes),
    });
  }

  _registry.post("/registerNode", (req: Request<any, any, Node>, res: Response) => {
    const { nodeId, pubKey } = req.body;

    console.log("Request body:", req.body);
    
    if (!nodeId || !pubKey) {
      console.log("Missing info");
      return res.status(400).json({ error: "Missing nodeId or pubKey" });
    }

    registeredNodes.push({ nodeId, pubKey });
    console.log("Node registered :", { nodeId, pubKey });
    return res.status(200).json({ message: "Node registered successfully" });
  });

  _registry.get("/status", (req: Request, res: Response) => {
    res.send("live");
  });

  _registry.get("/getNodeRegistry", getNodeRegistry);

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}

