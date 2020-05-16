const express = require("express")

const server = express()

server.get('/api/data', (req, res) => {
    res.send({
	"data": "sample data"
    })
})

const port = 5000
server.listen(port, () => console.log(`Your routes will be running on http://localhost:${port}`));
