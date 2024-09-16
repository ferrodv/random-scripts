import * as dotenv from "dotenv";

dotenv.config();
const config = {
  dev: process.env.NODE_ENV === "dev",
  prod: process.env.NODE_ENV === "prod",
  test: process.env.NODE_ENV === "test",
  enviroment: process.env.NODE_ENV,
  clickupAdminKey: process.env.CLICKUP_ADMIN_KEY,
  clickupTeam: process.env.CLICKUP_TEAM,
  clickupTeamId: process.env.CLICKUP_TEAM_ID,
  jiraApiEndpoint: process.env.JIRA_API_ENDPOINT,
  jiraAdminEmail: process.env.JIRA_ADMIN_EMAIL,
  jiraAdminKey: process.env.JIRA_ADMIN_KEY,
  sentryDSN: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.TRACES_SAMPLE_RATE,
};
export default config;
