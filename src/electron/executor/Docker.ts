import Docker from "dockerode";
import { exec } from "child_process";
import exp from "constants";

export const docker = new Docker();

interface DockerPingCallback {
  (err: Error | null, data: any): void;
}

export const isDockerInstalled = async (): Promise<Boolean> => {
  return new Promise((resolve) => {
    exec("docker --version", (error, stdout, stderr) => {
      if (error) {
        console.error("Docker is not installed:", error);
        resolve(false);
      } else {
        console.log("Docker is installed:", stdout);
        resolve(true);
      }
    });
  });
};

export const isDockerRunning = async (): Promise<Boolean> => {
  return new Promise((resolve) => {
    try {
      docker.ping((err: Error | null, data: any) => {
        if (err) {
          console.error("Docker is not running:", err);
          resolve(false);
        } else {
          console.log("Docker is running:", data);
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Error checking if Docker is running:", error);
      resolve(false);
    }
  });
};

export const getDockerImages = async (): Promise<Docker.ImageInfo[]> => {
  return new Promise((resolve, reject) => {
    docker.listImages((err, images) => {
      if (err) {
        console.error("Error fetching Docker images:", err);
        reject(err);
      } else {
        resolve(images || []);
      }
    });
  });
};

export const getDockerContainers = async (): Promise<
  Docker.ContainerInfo[]
> => {
  try {
    const containers = await docker.listContainers({ all: true });
    return containers;
  } catch (error) {
    console.error("Error listing containers:", error);
    throw error;
  }
};

export const getDockerNetworks = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    docker.listNetworks((err, networks) => {
      if (err) {
        console.error("Error fetching Docker networks:", err);
        reject(err);
      } else {
        resolve(networks || []);
      }
    });
  });
};

export const getDockerVolumes = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    docker.listVolumes((err, volumes) => {
      if (err) {
        console.error("Error fetching Docker volumes:", err);
        reject(err);
      } else {
        resolve((volumes && volumes.Volumes) || []);
      }
    });
  });
};

export function pullImage(imageName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    docker.pull(
      imageName,
      (err: Error | null, stream: NodeJS.ReadableStream) => {
        if (err) {
          console.error("Error pulling Docker image:", err);
          reject(err);
          return;
        }
        docker.modem.followProgress(stream, onFinished, onProgress);
      }
    );

    function onFinished(err: Error | null, output: any) {
      if (err) {
        console.error("Error during image pull:", err);
        reject(err);
      } else {
        console.log("Image pull finished:", output);
        resolve();
      }
    }

    function onProgress(event: any) {
      console.log("Image pull progress:", event);
    }
  });
}

export function startContainer(containerName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const container = docker.getContainer(containerName);
    container.start((err, data) => {
      if (err) {
        console.error("Error starting Docker container:", err);
        reject(err);
      } else {
        console.log("Docker container started:", data);
        resolve();
      }
    });
  });
}

export function createNetwork(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    docker.createNetwork({ Name: name }, (err, network) => {
      if (err) {
        console.error("Error creating Docker network:", err);
        reject(err);
      } else {
        console.log("Docker network created:", network);
        resolve();
      }
    });
  });
}

export function createVolume(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    docker.createVolume({ Name: name }, (err, volume) => {
      if (err) {
        console.error("Error creating Docker volume:", err);
        reject(err);
      } else {
        console.log("Docker volume created:", volume);
        resolve();
      }
    });
  });
}

export function createContainer(
  containerName: string,
  imageName: string,
  portBindings: any | undefined,
  hostConfig: any | undefined
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    docker.createContainer(
      {
        name: containerName,
        Image: imageName,
        ExposedPorts: portBindings,
        HostConfig: hostConfig,
      },
      (err, container) => {
        if (err) {
          console.error("Error creating Docker container:", err);
          reject(err);
        } else {
          console.log("Docker container created:", container);
          resolve(true);
        }
      }
    );
  });
}
