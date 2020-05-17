const express = require("express");
const server = express();
server.use("/public", express.static(__dirname + "/public"));
const path = require("path");
const configRoutes = require("./routes");

const logger = function (request, response, next) {
    const logString = `\n${new Date().toISOString()}
${request.method}\t${request.originalUrl}
BODY:\n${JSON.stringify(request.body, null, 2)}
QUERY:\t${JSON.stringify(request.query, null, 2)}
PARAM:\t${JSON.stringify(request.params, null, 2)}`

    console.log(logString);
    next()
};
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(logger);
configRoutes(server);
// server.get("/", (request, response, next) => {
//     response.sendFile(path.join(__dirname, "public", "html", "index.html"));
// });

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Your routes will be running on http://localhost:${port}`));
