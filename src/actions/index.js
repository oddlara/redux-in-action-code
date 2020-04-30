import * as api from "../api";
import { CALL_API } from '../middleware/api';

export const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED';
export const FETCH_TASKS_SUCCEEDED = 'FETCH_TASKS_SUCCEEDED';
export const FETCH_TASKS_FAILED = 'FETCH_TASKS_FAILED';
export const CREATE_TASK_STARTED = 'CREATE_TASK_STARTED';
export const CREATE_TASK_SUCCEEDED = 'CREATE_TASK_SUCCEEDED';
export const CREATE_TASK_FAILED = 'CREATE_TASK_FAILED';

// export function fetchTasksStarted() {
//   return {
//     type: "FETCH_TASKS_STARTED",
//   };
// }

// export function fetchTasksSucceeded(tasks) {
//   return {
//     type: "FETCH_TASKS_SUCCEEDED",
//     payload: {
//       tasks,
//     },
//   };
// }

// export function fetchTasksFailed(error) {
//   return {
//     type: "FETCH_TASKS_FAILED",
//     payload: {
//       error,
//     },
//   };
// }

// export function createTaskSucceeded(task) {
//   return {
//     type: "CREATE_TASK_SUCCEEDED",
//     payload: {
//       task,
//     },
//     meta: {
//       analytics: {
//         event: 'create_task',
//         data: {
//           id: task.id,
//         },
//       },
//     },
//   };
// }

export function updateTaskSucceeded(task) {
  return {
    type: "UPDATE_TASK_SUCCEEDED",
    payload: {
      task,
    },
  };
}

  export function fetchTasks() {
    return {
      [CALL_API]: {
        types: [FETCH_TASKS_STARTED, FETCH_TASKS_SUCCEEDED, FETCH_TASKS_FAILED],
        endpoint: '/tasks',
        method: 'GET'
      },
    };
  }

  // export function createTask({ title, description, status = "Unstarted" }) {
  //   return (dispatch) => {
  //     api.createTask({ title, description, status }).then((resp) => {
  //       dispatch(createTaskSucceeded(resp.data));
  //     });
  //   };
  // }

  export const createTask = ({title, description, status = "Unstarted"}) => {
    return {
      [CALL_API]: {
        types: [CREATE_TASK_STARTED, CREATE_TASK_SUCCEEDED, CREATE_TASK_FAILED],
        endpoint: '/tasks',
        method: 'POST',
        body: {title, description, status}
      }
    }
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
