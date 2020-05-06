import { call, put, take, takeLatest, delay } from "redux-saga/effects";
import { fetchTasks as api } from "./api";
import { channel } from "redux-saga";

export default function* rootSaga() {
  yield takeLatest("FETCH_TASKS_STARTED", fetchTasks);
  yield takeLatestById(["TIMER_STARTED", "TIMER_STOPPED"], handleProgressTimer);
}

function* fetchTasks() {
  try {
    const { data } = yield call(api);
    yield put({
      type: "FETCH_TASKS_SUCCEEDED",
      payload: { tasks: data },
    });
  } catch (e) {
    yield put({
      type: "FETCH_TASKS_FAILED",
      payload: { error: e.message },
    });
  }
}

function* takeLatestById(actionType, saga) {
	/** 
	 * This can be useful when we're dealing with managin of elements 
	 * In this case, these are Tasks, but they can be orders, or any type of element in a database
	 * not independent processes in the app. 
	 * This works to create independent processes for every element and avoid applying 
	 * an action two times (or more) on an element
	*/
  //here our process lives
  const channelsMap = {}; //first creates the channel storage
  while (true) {
    //and starts watching
    const action = yield take(actionType); //helds the action
    const { taskId } = action.payload; // takes info of the action

    if (!channelsMap[taskId]) {
      //if there's\no channel for that one
      channelsMap[taskId] = channel(); //creates a chanel
      yield takeLatest(channelsMap[taskId], saga); //and makes a separate process for it
    }
    yield put(channelsMap[taskId], action); //if there is one, puts that action to the process
  }
}
function* handleProgressTimer({ payload, type }) {
  if (type === "TIMER_STARTED") {
    while (true) {
      yield delay(1000);
      yield put({
        type: "TIMER_INCREMENT",
        payload: { taskId: payload.taskId },
      });
    }
  }
}
