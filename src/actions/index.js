import * as api from "../api";

export function fetchTasksStarted() {
  return {
    type: "FETCH_TASKS_STARTED",
  };
}

export function fetchTasksSucceeded(tasks) {
  return {
    type: "FETCH_TASKS_SUCCEEDED",
    payload: {
      tasks,
    },
  };
}

export function fetchTasksFailed(error) {
  return {
    type: "FETCH_TASKS_FAILED",
    payload: {
      error,
    },
  };
}

export function createTaskSucceeded(task) {
  return {
    type: "CREATE_TASK_SUCCEEDED",
    payload: {
      task,
    },
  };
}

export function updateTaskSucceeded(task) {
  return {
    type: "UPDATE_TASK_SUCCEEDED",
    payload: {
      task,
    },
  };
}

  export function fetchTasks() {
    return (dispatch) => {
      dispatch(fetchTasksStarted());
      api.fetchTasks().then(resp => {
        setTimeout(() => {
          //dispatch(fetchTasksSucceeded(resp.data));
          throw new Error('Oh noes!Hi mom');
        }, 2000);
      })
      .catch(err => {
        dispatch(fetchTasksFailed(err.message));
      });
    };
  }

  export function createTask({ title, description, status = "Unstarted" }) {
    return (dispatch) => {
      api.createTask({ title, description, status }).then((resp) => {
        dispatch(createTaskSucceeded(resp.data));
      });
    };
  }

  export function updateTask(id, params = {}) {
    return (dispatch, getState) => {
      const task = getTaskById(getState().tasks.tasks, id);
      const updatedTask = Object.assign({}, task, params);

      api.updateTask(id, updatedTask).then((resp) => {
        dispatch(updateTaskSucceeded(resp.data));
      });
    };
  }

  function getTaskById(tasks, id) {
    return tasks.find(task => task.id === id);
  }
