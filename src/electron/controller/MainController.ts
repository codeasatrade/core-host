import { Response, Request } from "express";
import { server } from "../main.js";
import { startInitialSetup } from "../service/DockerService.js";
import cors from "cors";

// Enable CORS for all routes
server.use(cors());

server.get("/status", (req: Request, res: Response) => {
  res.json({ status: "App is running" });
});

// Endpoint to check the health of the app
server.get("/health", (req, res) => {
  res.json({ health: "App is healthy" });
});

server.get("/initsetup", async (req, res: Response) => {
  try {
    const message: string = await startInitialSetup();
    res.setHeader("Content-Type", "text/plain");
    res.status(200);
    res.send({ message });
  } catch (error) {
    console.error("Error during initial setup:", error);
    res.status(500).json({ status: "Error during initial setup" });
  }
});

console.log("API routes are set up.");
