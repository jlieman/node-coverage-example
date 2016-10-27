export interface Callback {
    (err?: Error): void;
}

export interface ResultCallback<T> {
    (err?: Error, result?: T): void;
}