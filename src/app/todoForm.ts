import {Component} from 'angular2/core';
import {TaskDao} from '../contracts/taskDao';
import {DataService} from "./dataService";

@Component({
    selector: 'todo-form',
    template: `
    <form (ngSubmit)="addTask()">
      <input type="text" [(ngModel)]="task" size="30"
             placeholder="add new todo here">
      <input class="btn-primary" type="submit" value="add">
    </form>`
})
export class TodoForm {

    task: string = "";

    constructor(private data: DataService) {

    }

    addTask() {
        if (this.task) {
            this.data.addTask(this.task);
        }
        this.task = "";
    }
}