// const { createTodo, readTodo, updatetodo, deleteTodo } = require("../controller/todo.controller.js")
const { createTodo, readTodo, updatetodo, deleteTodo } = require("../controller/todo.controller.js")

const router = require("express").Router()

router
    .post("/create", createTodo)
    .get("/read", readTodo)
    .put("/update/:uid", updatetodo)
    .delete("/delete/:uid", deleteTodo)

module.exports = router