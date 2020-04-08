import express from 'express';
import React from 'react'
import ReactDOMServer from 'react-dom/server';
import App from "./components/App";

const configRoutes = require("./routes");

const server = express();
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({extended: true}));
configRoutes(server);


server.get("/", (request, response) => {
    const initialMarkup = ReactDOMServer.renderToString(<App/>);

    response.send(`
    <html>
      <head>
        <title>Sample React App</title>
      </head>
      <body>
        <div id="mountNode">${initialMarkup}</div>
        <script src="/js/bundle.js"></script>
      </body>
    </html>
  `)
});


server.listen(3000, () => console.log("Your routes will be running on http://localhost:3000"));