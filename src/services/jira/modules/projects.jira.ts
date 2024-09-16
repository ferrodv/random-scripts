import apiJira from "../config/api.jira";

export default class JiraProjects {
  static async getAll(): Promise<any[] | null> {
    try {
      const params: any = {
        startAt: 0,
        maxResults: 100,
        orderBy: "key",
      };
      let response = await apiJira.get(`/rest/api/3/project/search`, {
        params,
      });

      let { data } = response;
      let projects = data.values;

      while (Object.hasOwnProperty.call(data, "nextPage")) {
        params.startAt += params.maxResults;
        response = await apiJira.get(`/rest/api/3/project/search`, { params });
        data = response.data;
        projects = [...projects, ...data.values];
      }

      return projects;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
