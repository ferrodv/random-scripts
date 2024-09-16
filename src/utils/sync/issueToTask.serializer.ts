import config from "../../config";
import { clickupCustomFieldsIds, priorityMapper } from "../constants";

const getSprintNumber = (sprintName: string): number | null => {
  const num = sprintName.match(/\d/g);
  return num ? Number(num.join("")) : null;
};

const getLastSprint = (sprints: any[]): any => {
  let lastSprint: any = null;
  sprints.forEach((sprint: any) => {
    sprint.index = getSprintNumber(sprint.name);
    if ((lastSprint ? lastSprint.index : 0) < sprint.index) {
      lastSprint = sprint;
    }
  });
  return lastSprint;
};

export default (
  clickupMembers: any,
  issue: any,
  jiraProjectKey: string
): any => {
  const lastSprint = issue.fields.customfield_10020
    ? getLastSprint(issue.fields.customfield_10020)
    : null;
  return {
    name: issue.fields.summary,
    description: `${config.jiraApiEndpoint}/jira/software/projects/${jiraProjectKey}/issues/${issue.key}`,
    assignees: Object.hasOwnProperty.call(
      clickupMembers,
      issue.fields.assignee?.displayName || "null"
    )
      ? [clickupMembers[issue.fields.assignee.displayName]]
      : [],
    tags: [issue.fields.issuetype.name.toLocaleLowerCase()],
    status: issue.fields?.status?.name || "NOT DEFINED",
    priority: priorityMapper[issue.fields.priority.name] || null,
    start_date: lastSprint?.startDate
      ? new Date(lastSprint.startDate).getTime()
      : null,
    start_date_time: true,
    date_closed: issue.fields.resolutiondate
      ? new Date(issue.fields.resolutiondate).getTime()
      : null,
    date_closed_time: true,
    date_updated: issue.fields.updated
      ? new Date(issue.fields.updated).getTime()
      : null,
    date_updated_time: true,
    due_date: lastSprint?.endDate
      ? new Date(lastSprint.endDate).getTime()
      : null,
    due_date_time: true,
    time_estimate: issue.fields.timeoriginalestimate
      ? issue.fields.timeoriginalestimate * 1000
      : null,
    parent: null, // To Do
    links_to: null, // ?
    check_required_custom_fields: false,
    custom_fields: [
      {
        id: clickupCustomFieldsIds.jiraKey, // JIRA KEY CUSTOM FIELD
        value: issue.key,
      },
      {
        id: clickupCustomFieldsIds.sprintIndex, // SPRINT CUSTOM FIELD
        value: lastSprint?.index || null,
      },
      {
        id: clickupCustomFieldsIds.sprintPoints, // POINTS CUSTOM FIELD
        value: issue.fields.customfield_10016 || null,
      },
    ],
    sprintPoints: issue.fields.customfield_10016 || null,
    sprintIndex: lastSprint?.index || null,
  };
};
