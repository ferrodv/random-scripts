import apiClickup from "../config/api.clickup";

export default class ClickupTeams {
  static async getAll(): Promise<any[] | null> {
    try {
      const response = await apiClickup.get(`/api/v2/team`);

      const { teams } = response.data;

      return teams;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getTeamByName(teamName: string): Promise<any> {
    try {
      const response = await apiClickup.get(`/api/v2/team`);

      const { teams } = response.data;

      return teams.find((team: any) => team.name === teamName);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getTeamById(teamId: string): Promise<any> {
    try {
      const response = await apiClickup.get(`/api/v2/team/${teamId}`);

      const { team } = response.data;

      return team;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getTeamMembers(teamId: string, tries = 0): Promise<any> {
    if (tries >= 3) {
      console.log("Could not pull members from team: ", teamId);
      return null;
    }
    try {
      const response = await apiClickup.get(`/api/v2/team/${teamId}`);

      const { members } = response.data.team;

      const MembersMapByName: any = {};
      members.forEach((member: any) => {
        if (member.user.username)
          MembersMapByName[member.user.username] = member.user.id;
      });

      return MembersMapByName;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.getTeamMembers(teamId, tries + 1);
      }
      console.error(error);
      return null;
    }
  }
}
