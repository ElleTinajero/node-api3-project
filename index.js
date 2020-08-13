const express = require("express")
const logger = require("./middleware/logger")
const userRouter = require("./users/userRouter")

const server = express()
const port = 5000

server.use(express.json())
server.use(logger("long"))
server.use(userRouter)

server.listen(port, () => {
    console.log (`server running at http://localhost:${port}`)
})