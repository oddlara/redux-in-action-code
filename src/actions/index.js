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

// export function fetchTasks() {
//   return (dispatch) => {
//     dispatch(fetchTasksStarted());
//     api.fetchTasks().then(resp => {
//       setTimeout(() => {
//         dispatch(fetchTasksSucceeded(resp.data));
//         //throw new Error('Oh noes!Hi mom');
//       }, 2000);
//     })
//     .catch(err => {
//       dispatch(fetchTasksFailed(err.message));
//     });
//   };
// }

export function createTask({ title, description, status = "Unstarted" }) {
  return (dispatch) => {
    api.createTask({ title, description, status }).then((resp) => {
      dispatch(createTaskSucceeded(resp.data));
    });
  };
}

function progressTimerStart(taskId) {
  return { type: "TIMER_STARTED", payload: { taskId } };
}
function progressTimeStops(taskId) {
  return { type: "TIMER_STOPPED", payload: { taskId } };
}
export function updateTask(id, params = {}) {
  return (dispatch, getState) => {
    const task = getTaskById(getState().tasks.tasks, id);
    const updatedTask = Object.assign({}, task, params);

    api.updateTask(id, updatedTask).then((resp) => {
      dispatch(updateTaskSucceeded(resp.data));
      if (resp.data.status === "In Progress") {
       return dispatch(progressTimerStart(resp.data.id));
      }
      if(task.status === "In Progress"){
       return dispatch(progressTimeStops(resp.data.id));
      }
    });
  };
}

function getTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function filterTasks(searchTerm){
  console.log("this task has been called, filterTasks");
  return { type: 'FILTER_TASKS', payload: { searchTerm }};
}

function fetchProjectsStarted(boards){ 
  return { type: 'FETCH_PROJECTS_STARTED', payload: { boards }};
};

function fetchProjectsSucceeded(projects){
  return { type: 'FETCH_PROJECTS_SUCCEEDED', payload: { projects }};
}

function fetchProjectsFailed(err){
  return { type: 'FETCH_PROJECTS_FAILED', payload: err};
}

export function fetchProjects() {
  return (dispatch, getState) => {
    dispatch(fetchProjectsStarted());
    console.log("start fetching projects");
    return api
      .fetchProjects()
      .then(resp => {
        const projects = resp.data;
        console.log("result from fetching: ",projects);
        dispatch(fetchProjectsSucceeded(projects));
        dispatch(setCurrentProjectId(1));
      })
      .catch(err => {
        console.error(err);

        dispatch(fetchProjectsFailed(err));
      })
  }
}

export function setCurrentProjectId(projectId) {
  return {
    type: 'SET_CURRENT_PROJECT_ID',
    payload: {
      projectId,
    },
  };
}
