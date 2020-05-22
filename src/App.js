import React, { Component } from "react";
import { connect } from "react-redux";
import { createTask, updateTask, fetchTasks, fetchTasksStarted, filterTasks } from "./actions";
import TasksPage from "./components/TasksPage";
import FlashMessage from "./components/FlashMessage";

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTasksStarted());
  }

  onCreateTask = ({ title, description }) => {
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = (id, status) => {
    this.props.dispatch(updateTask(id, { status }));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  };

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <TasksPage
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onSearch={this.onSearch}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { isLoading, error, searchTerm } = state.tasks;
  
  const tasks = state.tasks.tasks.filter(task => {
    return task.title.match(new RegExp(searchTerm, 'i'));
  });


  return {
    tasks,
    isLoading,
    error,
  };
};

export default connect(mapStateToProps)(App);
