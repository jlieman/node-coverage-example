import {getIdentifier, Session} from "hydrate-mongodb";
import {Contract, Operation, Service} from "service-model";
import {Task, TaskStatus} from "./model";
import {Callback, ResultCallback} from "./callback";
import {TaskDao} from "../contracts/taskDao";
import {Registry} from "./registry";

@Contract("Todo")
@Service({ createOperationContext: true })
export class TodoService {

    private _session: Session;

    constructor() {

        this._session = Registry.current.session;
    }

    @Operation()
    getTasks(callback: ResultCallback<TaskDao[]>): void {

        this._findPending((err, pending) => {
            if(err) return callback(err);

            callback(null, pending.map(task => this._createTaskDao(task)));
        });
    }

    @Operation()
    archive(callback: ResultCallback<TaskDao[]>): void {

        this._findPending((err, pending) => {
            if(err) return callback(err);

            var remaining = pending.filter(task => !task.archive());

            callback(null, remaining.map(task => this._createTaskDao(task)));
        });
    }

    @Operation()
    addTask(text: string, callback: ResultCallback<TaskDao>) {

        var task = new Task(text);

        this._session.save(task, (err) => {
            if(err) return callback(err);

            callback(null, this._createTaskDao(task));
        });
    }

    @Operation()
    setCompleted(id: string, done: boolean, callback: Callback): void {

        this._session.find(Task, id, (err, task) => {
            if(err) return callback(err);

            task.status = done ? TaskStatus.Completed : TaskStatus.Pending;

            callback();
        });
    }

    private _findPending(callback: ResultCallback<Task[]>): void {

        this._session.query(Task).findAll({ status: TaskStatus.Pending }).sort('created', 1, callback);
    }

    private _createTaskDao(task: Task): TaskDao {

        // if the id of the document is not exposed on the model, you can retrieve it using getIdentifier
        return {
            id: getIdentifier(task),
            text: task.text,
            done: task.status === TaskStatus.Completed
        }
    }
}
