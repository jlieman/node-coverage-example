import {OperationContext} from "service-model";
import {SessionFactory, Session} from "hydrate-mongodb";

export class Registry {

    private static _serviceRegistryName = "service-registry";

    /**
     * Gets the current Registry.
     */
    static get current(): Registry {
        var registry = OperationContext.current.items.get(Registry._serviceRegistryName);
        if(!registry) {
            this.current = registry = new Registry();
        }
        return registry;
    }

    /**
     * Sets the current registry, overriding the default value. Used for testing.
     * @param value The registry to use.
     */
    static set current(value: Registry) {
        OperationContext.current.items.set(Registry._serviceRegistryName, value);
    }

    private static _sessionFactory: SessionFactory;

    static setSessionFactory(sessionFactory: SessionFactory): void {
        Registry._sessionFactory = sessionFactory;
    }

    private _session: Session;
    /**
     * Gets the current hydrate session.
     */
    get session(): Session {
        if(!this._session) {
            this._session = Registry._sessionFactory.createSession();
        }
        return this._session;
    }

    /**
     * Sets the current hydrate session.
     */
    set session(value: Session) {
        this._session = value;
    }

    /**
     * Returns true if we have a current hydrate session; otherwise, returns false.
     */
    get hasSession(): boolean {
        return this._session !== undefined;
    }
}
