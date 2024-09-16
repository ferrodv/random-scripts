import { clickupCustomFieldsIds } from "./constants";
import ClickupTasks from "../../services/clickup/modules/tasks.clickup";

export default async (
  clickupTask: any,
  jiraIssueSerialized: any,
  fieldsToUpdate: string[]
): Promise<any> => {
  if (fieldsToUpdate.includes("sprintIndex"))
    await ClickupTasks.updateTaskCustomFields(
      clickupTask.id,
      clickupCustomFieldsIds.sprintIndex,
      jiraIssueSerialized.sprintIndex
    );

  if (fieldsToUpdate.includes("sprintPoints"))
    await ClickupTasks.updateTaskCustomFields(
      clickupTask.id,
      clickupCustomFieldsIds.sprintPoints,
      jiraIssueSerialized.sprintPoints
    );

  if (fieldsToUpdate.includes("assigneesIds")) {
    const assignees: any = {
      add: jiraIssueSerialized.assignees || [],
      rem:
        clickupTask.assignees.length > 0
          ? clickupTask.assignees.map((assignee: any) => assignee.id)
          : [],
    };
    jiraIssueSerialized.assignees = assignees;
  }
  console.log("Updating Clickup Task... ", clickupTask.id);

  return ClickupTasks.updateTask(clickupTask.id, jiraIssueSerialized);
};
