import config from "../config";
import response from "../utils/response";
import { jiraClickupMapper } from "../utils/constants";
import JiraProjects from "../services/jira/modules/projects.jira";
import JiraIssues from "../services/jira/modules/issues.jira";
import ClickupTeams from "../services/clickup/modules/teams.clickup";
import ClickupFolders from "../services/clickup/modules/folders.clickup";
import ClickupLists from "../services/clickup/modules/lists.clickup";
import ClickupTasks from "../services/clickup/modules/tasks.clickup";
import issueToTaskSerializer from "../utils/sync/issueToTask.serializer";
import lookForUpdatesFunction from "../utils/sync/lookForUpdates.function";
import updateFunction from "../utils/sync/updateTask.function";

export async function handler() {
  try {
    const clickupMembers = await ClickupTeams.getTeamMembers(
      config.clickupTeamId || ""
    );

    const jiraProjects = await JiraProjects.getAll();
    if (jiraProjects === null)
      return response({ message: "There are no projects" });
    const report: any = {};
    await Promise.all(
      jiraProjects.map(async (jiraProject: any) => {
        if (jiraClickupMapper[jiraProject.id]) {
          let folder = await ClickupFolders.getFolderBySpaceAndName(
            jiraClickupMapper[jiraProject.id],
            `JIRA-${jiraProject.key}`
          );
          if (folder === undefined) {
            folder = await ClickupFolders.createFolderOnSpace(
              jiraClickupMapper[jiraProject.id],
              `JIRA-${jiraProject.key}`
            );
          }
          if (folder === null) return;

          let list = folder.lists.find(
            (folderList: any) => folderList.name === jiraProject.key
          );
          if (list === undefined) {
            list = await ClickupLists.createListOnFolder(
              folder.id,
              jiraProject.key
            );
          }
          if (list === null) return;

          const tasks = await ClickupTasks.getTasksByList(list.id);
          if (tasks === null) return;

          const issues = await JiraIssues.getIssuesByProject(jiraProject.key);
          if (issues === null) return;
          report[jiraProject.key] = {
            created: [],
            updated: [],
          };
          await Promise.all(
            issues.map(async (issue: any) => {
              const matchedTask = tasks.find((task: any) => {
                task.custom_fields.forEach((customField: any) => {
                  task[customField.name] = customField;
                });
                if (task.JiraKey) {
                  return task.JiraKey.value === issue.key;
                }
                return false;
              });
              const issueTask = issueToTaskSerializer(
                clickupMembers,
                issue,
                jiraProject.key
              );
              if (!matchedTask) {
                console.log("Creating... ", issue.key);
                const result = await ClickupTasks.createTaskOnList(
                  list.id,
                  issueTask
                );
                report[jiraProject.key].created.push({
                  result: result !== null ? "SUCCESS" : "FAILED",
                  ...issueTask,
                });
              } else {
                const fieldsToUpdate = lookForUpdatesFunction(
                  matchedTask,
                  issueTask
                );
                if (fieldsToUpdate.length > 0) {
                  const result = await updateFunction(
                    matchedTask,
                    issueTask,
                    fieldsToUpdate
                  );
                  report[jiraProject.key].updated.push({
                    result: result !== null ? "SUCCESS" : "FAILED",
                    fieldsToUpdate,
                    ...issueTask,
                  });
                }
              }
            })
          );
        }
      })
    );

    return response({ message: { report } });
  } catch (error) {
    console.error(error);
    return response({ message: "Not ok" }, 503);
  }
}
