/// <reference path="../../typings/es6-shim.d.ts"/>

import "reflect-metadata"
import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {TodoList} from './todoList';
import {TodoForm} from './todoForm';
import {DataService} from "./dataService";
import {TaskDao} from '../contracts/taskDao';
import {HTTP_PROVIDERS} from 'angular2/http';

@Component({
    selector: 'todo-app',
    template: `
    <h2>Todo</h2>
    <span>{{data.remaining}} of {{data.tasks.length}} remaining</span>
    [ <a href="javascript: false" (click)="archive()">archive</a> ]

    <todo-list></todo-list>
    <todo-form></todo-form>`,
    directives: [TodoList, TodoForm]
})
export class TodoApp {

    constructor(public data: DataService) {

    }

    archive(): void {
        this.data.archive();
    }
}

// Bootstrap Angular2 and inject the DataService
document.addEventListener('DOMContentLoaded', function () {
    bootstrap(TodoApp, [HTTP_PROVIDERS, DataService]);
});