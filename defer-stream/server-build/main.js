"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events = __importStar(require("events"));
const crypto = __importStar(require("crypto"));
const graphql_1 = require("graphql");
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const graphql_helix_1 = require("graphql-helix");
const app = express_1.default();
const eventEmitter = new events.EventEmitter();
const randomHashInterval = setInterval(() => {
    eventEmitter.emit("randomHash", crypto.randomBytes(20).toString("hex"));
}, 1000);
const context = {
    eventEmitter
};
const validationRules = [...graphql_1.specifiedRules];
app.use(cors_1.default());
app.use(express_1.default.json());
app.use("/graphql", async (req, res) => {
    // Create a generic Request object that can be consumed by Graphql Helix's API
    const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query
    };
    // Extract the GraphQL parameters from the request
    const { operationName, query, variables } = graphql_helix_1.getGraphQLParameters(request);
    // Validate and execute the query
    const result = await graphql_helix_1.processRequest({
        operationName,
        query,
        variables,
        request,
        schema: schema_1.schema,
        contextFactory: () => context,
        validationRules
    });
    // processRequest returns one of three types of results depending on how the server should respond
    // 1) RESPONSE: a regular JSON payload
    // 2) MULTIPART RESPONSE: a multipart response (when @stream or @defer directives are used)
    // 3) PUSH: a stream of events to push back down the client for a subscription
    if (result.type === "RESPONSE") {
        // We set the provided status and headers and just the send the payload back to the client
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        res.json(result.payload);
        return;
    }
    if (result.type === "MULTIPART_RESPONSE") {
        // Indicate we're sending a multipart response
        res.writeHead(200, {
            Connection: "keep-alive",
            "Content-Type": 'multipart/mixed; boundary="-"',
            "Transfer-Encoding": "chunked"
        });
        // If the request is closed by the client, we unsubscribe and stop executing the request
        req.on("close", () => {
            result.unsubscribe();
        });
        // We can assume a part be sent, either error, or payload;
        res.write("---");
        // Subscribe and send back each result as a separate chunk. We await the subscribe
        // call. Once we're done executing the request and there are no more results to send
        // to the client, the Promise returned by subscribe will resolve and we can end the response.
        await result.subscribe(result => {
            const chunk = Buffer.from(JSON.stringify(result), "utf8");
            const data = [
                "",
                "Content-Type: application/json; charset=utf-8",
                "",
                chunk
            ];
            if (result.hasNext) {
                data.push("---");
            }
            res.write(data.join("\r\n"));
        });
        res.write("\r\n-----\r\n");
        res.end();
    }
    else {
        // Indicate we're sending an event stream to the client
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache"
        });
        // If the request is closed by the client, we unsubscribe and stop executing the request
        req.on("close", () => {
            result.unsubscribe();
        });
        // We subscribe to the event stream and push any new events to the client
        await result.subscribe(result => {
            res.write(`data: ${JSON.stringify(result)}\n\n`);
        });
    }
});
const PORT = 4000;
const httpServer = app.listen(PORT, () => {
    console.log(`GraphQL Server listening on port ${PORT}.`);
});
process.once("SIGINT", () => {
    clearInterval(randomHashInterval);
    console.log("Received SIGINT. Shutting down HTTP and Websocket server.");
    httpServer.close();
});
