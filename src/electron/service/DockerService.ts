import Docker from "dockerode";

import {
  pullImage,
  getDockerContainers,
  getDockerImages,
  getDockerVolumes,
  getDockerNetworks,
  isDockerInstalled,
  isDockerRunning,
  createNetwork,
  startContainer,
  createContainer,
} from "../executor/Docker.js";
import { start } from "repl";

export const checkDockerInstalled = async (): Promise<Boolean> => {
  return new Promise(async (resolve) => {
    try {
      const installed = await isDockerInstalled();
      resolve(installed);
    } catch (error) {
      console.error("Docker is not installed.");
      resolve(false);
    }
  });
};

export const checkDockerRunning = async (): Promise<Boolean> => {
  return new Promise(async (resolve) => {
    try {
      const running = await isDockerRunning();
      resolve(running);
    } catch (error) {
      console.error("Docker is not running.");
      resolve(false);
    }
  });
};

export const getDockerImageData = async (id: string) => {
  return new Promise(async (resolve) => {
    try {
      const images = await getDockerImages();
      const image = images.find((image) => image.Id === id);
      resolve(image);
    } catch (error) {
      console.error("Docker is not installed or image not found.");
      resolve(false);
    }
  });
};

export const getDockerContainerData = async (id: string) => {
  return new Promise(async (resolve) => {
    try {
      const containers = await getDockerContainers();
      const container = containers.find((container) => container.Id === id);
      resolve(container);
    } catch (error) {
      console.error("Docker is not installed or container not found.");
      resolve(false);
    }
  });
};

export const getDockerVolumeData = async (id: string) => {
  return new Promise(async (resolve) => {
    try {
      const volumes = await getDockerVolumes();
      const volume = volumes.find((volume) => volume.Name === id);
      resolve(volume);
    } catch (error) {
      console.error("Docker is not installed or volume not found.");
      resolve(false);
    }
  });
};

export const getDockerNetworkData = async (id: string) => {
  return new Promise(async (resolve) => {
    try {
      const networks = await getDockerNetworks();
      const network = networks.find((network) => network.Id === id);
      resolve(network);
    } catch (error) {
      console.error("Docker is not installed or network not found.");
      resolve(false);
    }
  });
};

export const startInitialSetup = async (): Promise<string> => {
  console.log("Starting initial setup");
  var message: string = "";
  return new Promise(async (resolve, reject) => {
    try {
      if (await checkDockerInstalled()) {
        message += "Docker is installed.\n";
      } else {
        message += "Docker is not installed.\n";
        resolve(message);
        throw new Error("Docker is not installed.");
      }

      if (await checkDockerRunning()) {
        message += "Docker is running.\n";
      } else {
        message += "Docker is not running.\n";
        resolve(message);
        throw new Error("Docker is not running.");
      }

      // TODO store this in a file
      const coreDbCntnr = "/cat-core-db-local-container";
      const coreDBImage = "rajendra7406/cat-core-db:latest";
      if (await startContainerByImage(coreDbCntnr, coreDBImage)) {
        message += "cat-core-db-local-container is running.\n";
      } else {
        message += "cat-core-db-local-container is not running.\n";
        resolve(message);
        throw new Error(message);
      }

      if (await startNetwork("cat-network")) {
        message += "cat-network is running.\n";
      } else {
        message += "cat-network is not running.\n";
        resolve(message);
        throw new Error("cat-network is not running.");
      }

      // if (await startContainer("cat-core-host")) {
      //   message += "cat-core-host is running.\n";
      // } else {
      //   message += "cat-core-host is not running.\n";
      //   resolve(message);
      //   throw new Error("cat-core-host is not running.");
      // }
      resolve(message);
    } catch (error) {
      console.error("Error during initial setup:", error);
      reject(error); // Reject the promise with the error
    }
  });
};

export function startContainerByImage(
  containerName: string,
  imageName: string
) {
  return new Promise(async (resolve, reject) => {
    try {
      const containers: Docker.ContainerInfo[] = await getDockerContainers();
      const container = containers.find(
        (container) => container.Names?.includes(containerName)
        //&& container.Image === imageName
      );
      console.log("container  ", container);
      if (container?.State === "running") {
        console.log(`Container ${containerName} is already running`);
        resolve(container);
      } else if (
        container?.State === "exited" ||
        container?.State === "created"
      ) {
        console.log(`Starting container ${containerName}`);
        await startContainer(containerName.substring(1, containerName.length));
        resolve(container);
      } else {
        console.log(`Creating container ${containerName}`);
        // is image present
        const images: Docker.ImageInfo[] = await getDockerImages();
        const imageData = images.find((imageData) =>
          imageData.RepoTags?.includes(imageName)
        );
        console.log("imageData: ", imageData);
        if (!imageData) {
          console.log(`Pulling image ${imageName}`);
          await pullImage(imageName);
        }

        const createdContainer = await createContainer(
          containerName,
          imageName,
          undefined,
          undefined
        );

        if (createdContainer) {
          console.log(`Starting newly created container ${containerName}`);
          await startContainer(
            containerName.substring(1, containerName.length)
          );
          resolve(createdContainer);
        } else {
          reject(new Error(`Failed to create container ${containerName}`));
        }
      }
    } catch (error) {
      console.error(`Failed to start container ${containerName}:`, error);
      reject(error);
    }
  });
}

export function startNetwork(networkName: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const networks = await getDockerNetworks();
      const network = networks.find((network) => network.Name === networkName);
      if (network) {
        console.log(`Network ${networkName} already exists`);
        resolve(network);
      } else {
        console.log(`Creating network ${networkName}`);
        // Assuming there's a function to create a network
        const createdNetwork = await createNetwork(networkName);
        resolve(createdNetwork);
      }
    } catch (error) {
      console.error(`Failed to start network ${networkName}:`, error);
      reject(error);
    }
  });
}
