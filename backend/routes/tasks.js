var express = require('express')
var router = express.Router()
var Task = require('../models/tasks')
var User = require('../models/users')

// Update the newTask route
router.post('/newTask', (req, res) => {
    const { taskName, taskPriority, taskEndDate, taskUser } = req.body;

    const newTask = new Task({
        taskName,
        taskPriority,
        taskEndDate,
        taskUser
    });

    newTask.save().then((taskData, err) => {
        if (err) {
            console.error(err);
            return res.json({ result: false, error: 'Error saving task' });
        }

        res.json({ result: true, data: taskData });
    });
});

// Get all the tasks 
router.get('/', (req, res) => {
    Task.find({}).then(data => {
        res.json({ tasks: data })
    })
})

// Update the :token route
router.get('/:token', async (req, res) => {
    const userToken = req.params.token;

    try {
        const user = await User.findOne({ token: userToken }); // Corrected field name

        if (!user) {
            return res.status(404).json({ result: false, error: 'User not found' });
        }

        const tasks = [];
        for (const taskId of user.tasks) {
            const userTask = await Task.findById(taskId);
            tasks.push(userTask);
        }

        res.json({ result: true, taskdata: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, error: 'Internal Server Error' });
    }
});


router.delete('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;

        // Check if the task with the given ID exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // If the task exists, delete it
        await Task.findByIdAndDelete(taskId);

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router