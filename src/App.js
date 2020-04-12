import React, { Component } from "react";
import { connect } from "react-redux";
import { createTask, changeStatus } from "./actions";
import TasksPage from "./components/TasksPage";

class App extends Component {
  onCreateTask = ({ title, description }) => {
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = ( id, status ) => {
    this.props.dispatch(changeStatus(id, { status }));
  };

  render() {
    return (
      <div className="main-content">
        <TasksPage
          tasks={this.props.tasks}
          onCreateTask={this.onCreateTask}
          onStatusChange={this.onStatusChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
  };
};

export default connect(mapStateToProps)(App);
