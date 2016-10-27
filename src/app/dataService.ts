import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {RpcService} from "./rpcService";
import {TaskDao} from '../contracts/taskDao';

@Injectable()
export class DataService extends RpcService {

    tasks: TaskDao[] = [];

    constructor(http: Http) {
        super(http, "/api/todo");

        this.call("getTasks", (tasks: TaskDao[]) => {

            this.tasks = tasks;
        });
    }

    get remaining(): number {

        return this.tasks.reduce((remaining, task) => remaining + (task.done ? 0 : 1), 0)
    }

    archive(): void {

        this.call("archive", (remaining: TaskDao[]) => {

            this.tasks = remaining;
        });
    }

    addTask(text: string) {

        this.call("addTask", [text], (task: TaskDao) => {

            this.tasks.push(task);
        });
    }

    toggleDone(task: TaskDao): void {

        task.done = !task.done;

        this.call("setCompleted", [task.id, task.done]);
    }
}
