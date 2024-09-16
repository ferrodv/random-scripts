import apiJira from "../config/api.jira";

export default class JiraIssues {
  static async getAllIssues(): Promise<any[] | null> {
    try {
      const params: any = {
        startAt: 0,
        maxResults: 100,
      };
      let response = await apiJira.get(`/rest/api/3/search`, { params });

      let { data } = response;
      let { issues } = data;

      while (data.total > params.startAt + params.maxResults) {
        params.startAt += params.maxResults;
        response = await apiJira.get(`/rest/api/3/search`, { params });
        data = response.data;
        issues = [...issues, ...data.issues];
      }

      return issues;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getIssuesByProject(projectKey: string): Promise<any[] | null> {
    try {
      const params: any = {
        jql: `project=${projectKey}`,
        startAt: 0,
        maxResults: 100,
      };
      let response = await apiJira.get(`/rest/api/3/search`, { params });

      let { data } = response;
      let { issues } = data;

      while (data.total > params.startAt + params.maxResults) {
        params.startAt += params.maxResults;
        response = await apiJira.get(`/rest/api/3/search`, { params });
        data = response.data;
        issues = [...issues, ...data.issues];
      }

      return issues;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getIssueByKey(issueKey: string): Promise<any> {
    try {
      const response = await apiJira.get(`/rest/api/3/issue/${issueKey}`);

      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
