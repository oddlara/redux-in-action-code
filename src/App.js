import React, { Component } from "react";
import { connect } from "react-redux";
import { createTask, updateTask, fetchProjects, fetchTasksStarted, filterTasks, setCurrentProjectId } from "./actions";
import TasksPage from "./components/TasksPage";
import Header from "./components/Header";
import FlashMessage from "./components/FlashMessage";
import { getGroupedAndFilteredTasks } from './reducers';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchProjects());
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

  onCurrentProjectChange = e => {
    this.props.dispatch(setCurrentProjectId(Number(e.target.value)));
  }

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <Header
            projects={this.props.projects}
            onCurrentProjectChange={this.onCurrentProjectChange}
            />
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
  const { isLoading, error, items } = state.projects;

  return {
    tasks: getGroupedAndFilteredTasks(state),
    projects: items,
    isLoading,
    error,
  };
};

export default connect(mapStateToProps)(App);
