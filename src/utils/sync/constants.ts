export const jiraProjectsIds = {
  SPAR: "10042",
  SUN: "10028",
};

export const ClickupSpacesIds = {
  TestJiraSync: "90080246535",
  Sunlight: "90080298169"
};

export const jiraClickupMapper = {
  [jiraProjectsIds.SUN]: ClickupSpacesIds.Sunlight,
};

export const priorityMapper = {
  Highest: "1",
  High: "2",
  Medium: "3",
  Low: "4",
  Lowest: null,
};

export const clickupCustomFieldsIds = {
  jiraKey: "d31cba1b-e7f1-4207-8560-186322eb6659",
  sprintPoints: "c57e699f-5d1f-4892-b37f-2ffd422fcff5",
  sprintIndex: "16bb098b-f22c-475f-920c-45ad6106b440",
};
