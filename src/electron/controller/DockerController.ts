import { server } from "../main.js";
import {
  checkDockerInstalled,
  checkDockerRunning,
  getDockerImageData,
  getDockerContainerData,
  getDockerVolumeData,
  getDockerNetworkData,
} from "../service/DockerService.js";

server.get("/docker/installed", async (req, res) => {
  try {
    const installed = await checkDockerInstalled();
    res.json({ installed });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

server.get("/docker/running", async (req, res) => {
  try {
    const running = await checkDockerRunning();
    res.json({ running });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

server.get("/docker/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const imageData = await getDockerImageData(id);
    res.json({ imageData });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

server.get("/docker/containers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const containerData = await getDockerContainerData(id);
    res.json({ containerData });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

server.get("/docker/volumes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const volumeData = await getDockerVolumeData(id);
    res.json({ volumeData });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

server.get("/docker/network/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const networkData = await getDockerNetworkData(id);
    res.json({ networkData });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
