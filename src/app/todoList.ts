import {Component} from 'angular2/core';
import {DataService} from "./dataService";
import {TaskDao} from '../contracts/taskDao';

@Component({
    selector: 'todo-list',
    styles: [`
    .done-true {
      text-decoration: line-through;
      color: grey;
    }`
    ],
    template: `
    <ul class="unstyled">
      <li *ngFor="#task of data.tasks">
        <input type="checkbox" [checked]="task.done" (change)="toggleDone(task)">
        <span class="done-{{task.done}}">{{task.text}}</span>
      </li>
    </ul>`
})
export class TodoList {

    constructor(public data: DataService) {

    }

    toggleDone(task: TaskDao): void {

        this.data.toggleDone(task);
    }
}
