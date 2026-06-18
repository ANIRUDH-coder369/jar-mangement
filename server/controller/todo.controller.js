const Todo = require('../model/todo.model.js')

exports.createTodo = async (req, res) => {
    try {
        const { task, priority, desc } = req.body
        await Todo.create({ task, desc, priority })
        res.status(200).json({ message: "create success" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'error' })
    }
}

exports.readTodo = async (req, res) => {
    try {
        const result = await Todo.find()
        res.status(200).json({
            message: "success",
            result: result.map(item => ({
                _id: item._id,
                task: item.task,
                desc: item.desc,
                priority: item.priority
            }))
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'error' })
    }
}

exports.updatetodo = async (req, res) => {
    try {
        const { uid } = req.params
        const { task, desc, priority } = req.body

        await Todo.findByIdAndUpdate(uid, { task, desc, priority })

        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'fail' })

    }
}
exports.deleteTodo = async (req, res) => {
    try {
        const { uid } = req.params
        await Todo.findByIdAndDelete(uid)
        res.status(200).json({ message: " success" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'error' })

    }
}