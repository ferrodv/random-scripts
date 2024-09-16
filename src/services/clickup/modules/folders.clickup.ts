import apiClickup from "../config/api.clickup";

export default class ClickupFolders {
  static async getFoldersBySpace(
    spaceId: string,
    tries = 0
  ): Promise<any[] | null> {
    if (tries >= 3) {
      console.log("Could not pull folders from space: ", spaceId);
      return null;
    }
    try {
      const response = await apiClickup.get(`/api/v2/space/${spaceId}/folder`);

      const { folders } = response.data;

      return folders;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.getFoldersBySpace(spaceId, tries + 1);
      }
      console.error(error);
      return null;
    }
  }

  static async getFolderBySpaceAndName(
    spaceId: string,
    folderName: string,
    tries = 0
  ): Promise<any> {
    if (tries >= 3) {
      console.log("Could not pull folder: ", folderName);
      return null;
    }
    try {
      const response = await apiClickup.get(`/api/v2/space/${spaceId}/folder`);

      const { folders } = response.data;

      return folders.find((folder: any) => folder.name === folderName);
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.getFolderBySpaceAndName(spaceId, folderName, tries + 1);
      }
      console.error(error);
      return null;
    }
  }

  static async createFolderOnSpace(
    spaceId: string,
    folderName: string,
    tries = 0
  ): Promise<any> {
    if (tries >= 3) {
      console.log("Could not create folder: ", folderName);
      return null;
    }
    try {
      const response = await apiClickup.post(
        `/api/v2/space/${spaceId}/folder`,
        {
          name: folderName,
        }
      );

      return response.data;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.createFolderOnSpace(spaceId, folderName, tries + 1);
      }
      console.error(error);
      return null;
    }
  }
}
