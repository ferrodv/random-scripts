import apiClickup from "../config/api.clickup";

export default class ClickupSpaces {
  static async getAll(teamId: string): Promise<any[] | null> {
    try {
      const response = await apiClickup.get(`/api/v2/team/${teamId}/space`);

      const { spaces } = response.data;

      return spaces;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
