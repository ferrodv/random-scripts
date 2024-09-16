import apiClickup from "../config/api.clickup";

export default class ClickupLists {
  static async getListsByFolder(folderId: string): Promise<any[]> {
    try {
      const response = await apiClickup.get(`/api/v2/folder/${folderId}/list`);

      const { lists } = response.data;

      return lists;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async getListByFolderAndName(
    folderId: string,
    listName: string
  ): Promise<any> {
    try {
      const response = await apiClickup.get(`/api/v2/folder/${folderId}/list`);

      const { lists } = response.data;

      return lists.find((list: any) => list.name === listName);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async createListOnFolder(
    folderId: string,
    listName: string,
    tries = 0
  ): Promise<any> {
    if (tries >= 3) {
      console.log("Could not create list: ", listName);
      return null;
    }
    try {
      const response = await apiClickup.post(
        `/api/v2/folder/${folderId}/list`,
        {
          name: listName,
          content: "Tasks pulled from JIRA",
          status: "blue",
        }
      );

      return response.data;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.createListOnFolder(folderId, listName, tries + 1);
      }
      console.error(error);
      return null;
    }
  }

  static async getFolderlessListsBySpace(spaceId: string): Promise<any[]> {
    try {
      const response = await apiClickup.get(`/api/v2/space/${spaceId}/folder`);

      const { lists } = response.data;

      return lists;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
