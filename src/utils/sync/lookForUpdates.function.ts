/* eslint-disable eqeqeq */
export default (clickupTask: any, jiraIssue: any): any => {
  const jiraAssignees =
    jiraIssue.assignees[0] !== null ? jiraIssue.assignees.sort() : [];
  const clickupAssignees =
    clickupTask.assignees.length > 0
      ? clickupTask.assignees.map((assignee: any) => assignee.id).sort()
      : [];

  const clickupTags =
    clickupTask.tags.length > 0
      ? clickupTask.tags.map((tag: any) => tag.name).sort()
      : [];

  const issue: any = {
    title: jiraIssue.name,
    description: jiraIssue.description,
    assigneesIds: JSON.stringify(jiraAssignees),
    tags: JSON.stringify(jiraIssue.tags.sort()),
    status: jiraIssue.status.toLocaleLowerCase(),
    priority: jiraIssue.priority,

    startDate: jiraIssue.start_date,
    dueDate: jiraIssue.due_date,

    timeEstimate: jiraIssue.time_estimate,
    sprintPoints: jiraIssue.sprintPoints,
    sprintIndex: jiraIssue.sprintIndex,

    // parent: jiraIssue.parent
    // links_to: jiraIssue.links_to
  };
  const task: any = {
    title: clickupTask.name,
    description: clickupTask.description,
    assigneesIds: JSON.stringify(clickupAssignees),
    tags: JSON.stringify(clickupTags),
    status: clickupTask.status.status.toLocaleLowerCase(),
    priority: clickupTask.priority?.id || null,

    startDate: clickupTask.start_date ? Number(clickupTask.start_date) : null,
    dueDate: clickupTask.due_date ? Number(clickupTask.due_date) : null,

    timeEstimate: clickupTask.time_estimate,
    sprintPoints: clickupTask.Points.value || null,
    sprintIndex: clickupTask.Sprint.value || null,

    // parent: jiraIssue.parent
    // links_to: jiraIssue.links_to
  };
  const keysWithChanges: string[] = [];
  Object.keys(issue).forEach((key: string) => {
    if (issue[key] != task[key]) keysWithChanges.push(key);
  });
  return keysWithChanges;
};
