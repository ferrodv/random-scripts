import config from "../../../config";
import apiClickup from "../config/api.clickup";

export default class ClickupTasks {
  static async getTasksByList(
    listId: string,
    tries = 0,
    page = 0
  ): Promise<any[] | null> {
    if (tries >= 5) {
      console.log("Could not pull all tasks from: ", listId);
      return null;
    }
    let tasks: any[] = [];
    const params: any = {
      page,
      order_by: "id",
      subtasks: true,
      include_closed: true,
    };
    try {
      let response = await apiClickup.get(`/api/v2/list/${listId}/task`, {
        params,
      });

      let { data } = response;
      tasks = data.tasks;
      while (!data.last_page) {
        params.page += 1;
        response = await apiClickup.get(`/api/v2/list/${listId}/task`, {
          params,
        });
        data = response.data;
        tasks = [...tasks, ...data.tasks];
      }

      return tasks;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        const newTasks = await this.getTasksByList(
          listId,
          tries + 1,
          params.page
        );
        return newTasks !== null ? [...tasks, ...newTasks] : null;
      }
      console.error(error);
      return null;
    }
  }

  static async createTaskOnList(
    listId: string,
    task: any,
    tries = 0
  ): Promise<any> {
    if (tries >= 10) {
      console.log("Task could not be created: ", task.description);
      return null;
    }
    try {
      const params: any = {
        custom_task_ids: true,
        notify_all: false,
      };
      const response = await apiClickup.post(
        `/api/v2/list/${listId}/task`,
        task,
        { params }
      );

      return response.data;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.createTaskOnList(listId, task, tries + 1);
      }
      console.error(error);
      return null;
    }
  }

  static async updateTask(taskId: string, task: any, tries = 0): Promise<any> {
    if (tries >= 10) {
      console.log("Task could not be Updated: ", taskId);
      return null;
    }
    try {
      const params: any = {
        custom_task_ids: true,
        team_id: config.clickupTeamId,
      };
      const response = await apiClickup.put(`/api/v2/task/${taskId}`, task, {
        params,
      });

      return response.data;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.updateTask(taskId, task, tries + 1);
      }
      console.error(error);
      return null;
    }
  }

  static async updateTaskCustomFields(
    taskId: string,
    customFieldId: any,
    value: any,
    tries = 0
  ): Promise<any> {
    if (tries >= 10) {
      console.log("Task's custom field could not be Updated : ", taskId);
      return null;
    }
    try {
      const params: any = {
        custom_task_ids: true,
        team_id: config.clickupTeamId,
      };
      const response = await apiClickup.post(
        `/api/v2/task/${taskId}/field/${customFieldId}`,
        { value },
        { params }
      );

      return response.data;
    } catch (error) {
      if (error.response.status === 429) {
        console.log("Rate limit Reached... Waiting 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 60001));
        return this.updateTaskCustomFields(
          taskId,
          customFieldId,
          value,
          tries + 1
        );
      }
      console.error(error);
      return null;
    }
  }
}
