import { createSelector } from 'reselect';
import { TASKS_STATUSES } from '../constants';
import TaskList from '../components/TaskList';


const getSearchTerm = state => state.page.searchTerm;

export const getProjects = state => {
  return Object.keys(state.projects.items).map(id => {
    return state.projects.items[id];
  });
};

const getTasksByProjectId = state => {
  const { currentProjectId } = state.page;
  if (!state.page.currentProjectId || !state.projects.items[currentProjectId]) {
    return [];
  }

  const taskIds = state.projects.items[currentProjectId].tasks;

  return taskIds.map(id => state.tasks.items[id]);
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

const initialTasksState = {
  items: [],
  isLoading: false,
  error: null,
};

export function tasks(state = initialTasksState, action ){
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if(entities && entities.tasks) {
        return {
          ...state,
          isLoading: false,
          items: entities.tasks,
        };
      }

      return state;
    }
    case 'TIMER_INCREMENT': {
      const nextTasks = Object.keys(state.items).map(taskId => {
        const task = state.items[taskId];

        if(task.id === action.payload.taskId) {
          return { ...task, timer: task.timer + 1};
        }

        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      };
    }
    case 'CREATE_TASK_SUCCEEDED': 
    case 'UPDATE_TASK_SUCCEEDED': {
      const { task } = action.payload;

      const nextTasks = {
        ...state.items,
        [task.id]: task,
      };
      return {
        ...state,
        items: nextTasks,
      };
    }
    default: {
      return state;
    }
  }
}

const initialProjectsState = {
  items: {},
  isLoading: false,
  error: null,
};


export function projects(state = initialProjectsState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if(entities && entities.projects) {
        return { 
          ...state,
          isLoading: false,
          items: entities.projects,
        };
      }

      return state;
    }

    default: {
      return state;
    }
    // case 'FETCH_PROJECTS_SUCCEEDED': {
    //   return {
    //     ...state,
    //     isLoading: false,
    //     items: action.payload.projects,
    //   };
    // }

    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.payload.searchTerm };
    }

    // case "FETCH_TASKS_STARTED": {
    //   return {
    //     ...state,
    //     isLoading: true,
    //   }
    // }
    // case "FETCH_TASKS_SUCCEEDED": {
    //   return {
    //     ...state,
    //     isLoading: false,
    //     tasks: action.payload.tasks,
    //   };
    // }
    // case "FETCH_TASKS_FAILED": {
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: action.payload.error,
    //   };
    // }
    case "CREATE_TASK_SUCCEEDED": {

      const { task } = action.payload;

      const project = state.items[task.projectId];

      console.log("projectId: ", task);
      console.log("project: ", project);
      console.log(state);
      return {
        ...state,
        items: {
          ...state.items,
          [task.projectId]: {
            ...project,
            tasks: project.tasks.concat(task.id),
          },
        }
      };
    }
    // case "UPDATE_TASK_SUCCEEDED": {
    //   const { task } = action.payload;
    //   console.log(state.items);
    //   const projectIndex = state.items.findIndex(
    //     project => project.id === task.projectId,
    //   );
    //   const project = state.items[projectIndex];
    //   const taskIndex = project.tasks.findIndex(t => t.id === task.id);

    //   const nextProject = {
    //     ...project,
    //     tasks: [
    //       ...project.tasks.slice(0, taskIndex),
    //       task,
    //       ...project.tasks.slice(taskIndex + 1),
    //     ]
    //   };

    //   return {
    //     ...state,
    //     items: [
    //       ...state.items.slice(0, projectIndex),
    //       nextProject,
    //       ...state.items.slice(projectIndex + 1),
    //     ],
    //   };
    // }
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
