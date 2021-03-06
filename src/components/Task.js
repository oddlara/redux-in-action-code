import React from 'react';

const TASK_STATUSES = [
    "Unstarted",
    "In Progress",
    "Completed"
]

const Task = props => {
    return (
        <div className="task">
            <div className="task-header">
                <div>{props.task.title}</div>
                <select value={props.task.status} onChange={onStatusChange}>
                    {TASK_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>  
                    ))}
                </select>
            </div>
            <br />
            <div className="task-body">
                {props.task.description}
                <div className="task-timer">{props.task.timer}s</div>
                </div>
            <hr />
        </div>
    );

    function onStatusChange(event) {
        props.onStatusChange(props.task.id, event.target.value)
    }
}

export default Task;