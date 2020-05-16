const express = require("express");
const server = express();
server.use("/public", express.static(__dirname + "/public"));
const path = require("path");
const configRoutes = require("./routes");


server.use(express.json());
server.use(express.urlencoded({extended: true}));
configRoutes(server);
// server.get("/", (request, response, next) => {
//     response.sendFile(path.join(__dirname, "public", "html", "index.html"));
// });

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Your routes will be running on http://localhost:${port}`));
