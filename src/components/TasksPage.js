import React, { Component } from 'react';
import TaskList from './TaskList';

const TASK_STATUSES = ['Unstarted', 'In Progress', 'Completed'];
  

class TasksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewCardForm: false,
      title: '',
      description: '',
    };
  }
  
  onTitleChange = (event) => {
    this.setState({ title: event.target.value });
  }

  onDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  }

  resetForm() {
    this.setState({
      showNewCardForm: false,
      title: '',
      description: '',
    });
  }

  onCreateTask = (event) => {
    event.preventDefault();
    this.props.onCreateTask({
      title: this.state.title,
      description: this.state.description,
    });
    this.resetForm();
  }

  toggleForm = () => {
    this.setState({ showNewCardForm: !this.state.showNewCardForm });
  }
  renderTaskLists() {
      const  { tasks }  = this.props;
      const statusTasks = tasks.filter(task => task.status === "In Progress");
      console.log(statusTasks);
      return TASK_STATUSES.map(status => {
          const statusTasks = tasks.filter(task => task.status === status);
          return (
          <TaskList 
          key={status} 
          status={status} 
          tasks={statusTasks}
          onStatusChange={this.props.onStatusChange } />
          );
    });
  }

  render() {
    return (
        <div className="task-list">
          <div className="task-list-header">
            <button
              className="button button-default"
              onClick={this.toggleForm}
              >
                + New Task
              </button>
          </div>
          {this.state.showNewCardForm && (
            <form className="task-list-form" onSubmit={this.onCreateTask}>
              <input
                className="full-width-input"
                onChange={this.onTitleChange}
                value={this.state.title}
                type="text"
                placeholder="title"
                />
              <input
                className="full-width-input"
                onChange={this.onDescriptionChange}
                value={this.state.description}
                type="text"
                placeholder="description"
              />
              <button
                className="button"
                type="submit"
                >
                  Save
                </button>
            </form>
          )}
          <div className="task-lists">
            {this.renderTaskLists()}
          </div>
        </div>
    );
  }
}

export default TasksPage;