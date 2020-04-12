let _id = 1;

export function getUniqueId() {
  return _id++;
}

export function createTask({ title, description }) {
  return {
    type: "CREATE_TASK",
    payload: {
      id: getUniqueId(),
      title,
      description,
      status: 'Unstarted',
    },
  };
}

export function changeStatus(id, params = {}){
  return {
    type: "CHANGE_STATUS",
    payload: {
      id: id,
      params,
    }
  };
}
