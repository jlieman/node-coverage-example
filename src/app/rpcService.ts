import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

@Injectable()
export abstract class RpcService {

    private _baseUrl: string;
    private _http: Http;

    constructor(http: Http, baseUrl: string) {

        this._http = http;
        this._baseUrl = baseUrl;
    }

    protected call(method: string, callback?: (response?: any) => void): void;
    protected call(method: string, args?: any[], callback?: (response?: any) => void): void;
    protected call(method: string, argsOrCallback?: any, callback?: (response?: any) => void): void {

        var args: any[];

        if(!callback && typeof argsOrCallback === "function") {
            callback = argsOrCallback;
        }
        else {
            args = argsOrCallback;
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this._http.post(this._baseUrl, this._createRequest(method, args), { headers }).subscribe((response: Response) => {

            var result = response.json();
            if(result.fault) {
                console.error(result.fault);
            }
            else if(callback) {
                callback(result.response);
            }
        }, error => {
            console.error(error);
        });
    }

    private _createRequest(method: string, args: any[]): string {

        var request: any = {};
        request[method] = args || [];

        return JSON.stringify(request);
    }
}
