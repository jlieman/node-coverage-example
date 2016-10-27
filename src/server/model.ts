import {Entity, Field, Enumerated, Id} from "hydrate-mongodb";

export enum TaskStatus {

    Pending,
    Completed,
    Archived
}

@Entity()
export class Task {

    @Field()
    text: string;

    @Enumerated(TaskStatus)
    status: TaskStatus;

    @Field()
    created: Date;

    constructor(text: string) {

        this.created = new Date();
        this.status = TaskStatus.Pending;
        this.text = text;
    }

    archive(): boolean {

        if(this.status == TaskStatus.Completed) {
            this.status = TaskStatus.Archived;
            return true;
        }
        return false;
    }
}
