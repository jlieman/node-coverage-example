import {Session} from "hydrate-mongodb";
import {
    OperationInvoker,
    OperationContext,
    ServiceBehavior,
    ServiceDescription,
    DispatchService
} from "service-model";
import {Registry} from "./registry";
import {ResultCallback} from "./callback";

/**
 * Service Behavior that automatically closes the hydrate session after the execution of an operation.
 */
export class HydrateBehavior implements ServiceBehavior {

    applyServiceBehavior(description: ServiceDescription, service: DispatchService): void {

        service.endpoints.map(endpoint => {

            endpoint.operations.map(operation => {

                operation.invoker = new HydrateOperationInvoker(operation.invoker);
            });
        });
    }
}

class HydrateOperationInvoker implements OperationInvoker {

    private _innerInvoker: OperationInvoker;

    constructor(innerInvoker: OperationInvoker) {

        this._innerInvoker = innerInvoker;
    }

    invoke(instance: Object, args: any[], callback: ResultCallback<any>): void {

        var registry = Registry.current;

        this._innerInvoker.invoke(instance, args, (err, result) => {
            if (err) return callback(err);

            if(registry.hasSession) {

                registry.session.close((err) => {
                    if (err) return callback(err);

                    callback(null, result);
                });
            }
            else {
                callback(null, result);
            }
        });
    }
}

