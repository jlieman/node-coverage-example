import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import {DispatcherFactory, RpcBehavior, ExpressRequestContext} from "service-model";
import {MongoClient} from "mongodb";
import {Configuration, AnnotationMappingProvider, ChangeTrackingType} from "hydrate-mongodb";
import {TodoService} from "./todoService";
import {HydrateBehavior} from "./hydrateBehavior";
import {Registry} from "./registry";
import * as model from "./model";
import {install as installSourceMapSupport} from "source-map-support";

// enable source map support in node stack traces
installSourceMapSupport();

// establish the connection to the database
MongoClient.connect("mongodb://localhost:27017/test", (err, db) => {
    if (err) throw err;

    // configure hydrate and create the session factory
    var config = new Configuration();
    config.changeTracking = ChangeTrackingType.DeferredImplicit;
    config.addMapping(new AnnotationMappingProvider(model));

    config.createSessionFactory(db, (err, sessionFactory) => {
        if (err) throw err;

        // configure the registry
        Registry.setSessionFactory(sessionFactory);

        // configure express
        var app = express();
        app.set("port", process.env.PORT || 3000);
        app.use(bodyParser.json());

        // setup serving of static files
        app.use(express.static(path.join(__dirname, "./public")));

        // configure dispatcher
        var factory = new DispatcherFactory();
        var service = factory.addService(TodoService);
        service.behaviors.push(new HydrateBehavior());
        service.addEndpoint("Todo", "/api/todo", [new RpcBehavior()]);

        // handle api requests with the dispatcher
        var dispatcher = factory.createDispatcher();
        app.use("/api*", (req, res) => dispatcher.dispatch(new ExpressRequestContext(req, res)));

        // start the http server
        var server = app.listen(app.get("port"), () => {
            console.log("Server listening on port " + server.address().port);
        });
    });
});

