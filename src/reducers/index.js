import { createSelector } from 'reselect';
import { TASKS_STATUSES } from '../constants';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const getSearchTerm = state => state.page.searchTerm;

const getTasksByProjectId = state => {
  console.log("state I'm receiving now: ", state);
  if (!state.page.currentProjectId) {
    return [];
  }
  
  console.log("items in projects: ", state.projects.items);
  const currentProject = state.projects.items.find(
    project => project.id === state.page.currentProjectId,
  );

  return currentProject.tasks;
}

export const getFilteredTasks = createSelector(
  [getTasksByProjectId, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter(task => task.title.match(new RegExp(searchTerm,
    'i')));
  },
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  tasks => {
    const grouped = {};

    TASKS_STATUSES.forEach(status => {
      grouped[status] = tasks.filter(task => task.status === status);
    });

    return grouped;
  },
);


export function projects(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS_STARTED': {
      return { 
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_PROJECTS_SUCCEEDED': {
      return {
        ...state,
        isLoading: false,
        items: action.payload.projects,
      };
    }

    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.payload.searchTerm };
    }

    case "FETCH_TASKS_STARTED": {
      return {
        ...state,
        isLoading: true,
      }
    }
    case "FETCH_TASKS_SUCCEEDED": {
      return {
        ...state,
        isLoading: false,
        tasks: action.payload.tasks,
      };
    }
    case "FETCH_TASKS_FAILED": {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case "CREATE_TASK_SUCCEEDED": {

      const { task } = action.payload;
      const projectIndex = state.items.findInxed(
        project => project.id === task.projectId,
      );
      const project = state.items[projectIndex];

      const nextProject = {
        ...project,
        tasks: project.tasks.concat(task),
      };

      return {
        ...state,
        items: [
          ...state.items.slice(0, projectIndex),
          nextProject,
          ...state.items.slice(projectIndex + 1),
        ],
      };
    }
    case "UPDATE_TASK_SUCCEEDED": {
      const { task } = action.payload;
      const projectIndex = state.items.findIndex(
        project => project.id === task.projectId,
      );
      const project = state.items[projectIndex];
      const taskIndex = project.tasks.findIndex(t => t.id === task.id);

      const nextProject = {
        ...project,
        tasks: [
          ...project.tasks.slice(0, taskIndex),
          task,
          ...project.tasks.slice(taskIndex + 1),
        ]
      };

      return {
        ...state,
        items: [
          ...state.items.slice(0, projectIndex),
          nextProject,
          ...state.items.slice(projectIndex + 1),
        ],
      };
    }
    case 'TIMER_INCREMENT': {
      const nextTasks = state.tasks.map(task => {
        if(task.id === action.payload.taskId ) {
          return {  ...task, timer: task.timer + 1};
        }
        return task;
      });
      return { ...state, tasks: nextTasks};
    }
    default: {
      return state;
    }
  }
}

const initialPageState = {
  currentProjectId: null,
  searchTerm: '',
};

export function page(state = initialPageState, action) {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT_ID': {
      return {
        ...state,
        currentProjectId: action.payload.projectId,

      };
    }
    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.searchTerm};

    }
    default: {
      return state;
    }
  }
}
