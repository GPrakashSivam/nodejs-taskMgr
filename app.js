// app.js
const express = require('express');
const bodyParser = require('body-parser');
const Task = require('./models/Task');
const sequelize = require('./db');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define routes for CRUD operations

// Create a task
app.post('/task', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.create({ title, description, status, dueDate: new Date(dueDate) });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create task' });
  }
});

// Update a task
app.put('/task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, dueDate } = req.body;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.title = title;
    task.description = description;
    task.status = status;
    task.dueDate = new Date(dueDate);
    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update task' });
  }
});

// Get all tasks (paginated)
app.get('/tasks', async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    const tasks = await Task.findAndCountAll({
      limit: pageSize,
      offset,
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve tasks' });
  }
});

// Get task metrics
app.get('/task-metrics', async (req, res) => {
  try {
    // Fetch the timelineMetrics data
    const timelineMetrics = await Task.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('dueDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('dueDate')), 'year'],
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count'],
      ],
      group: ['month', 'year', 'status'],
      order: [['year', 'ASC'], ['month', 'ASC']],
    });

    // Define an array to hold the formatted timeline data
    const timelineData = [];

    // Create an object to map month numbers to month names
    const monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    // Group the timelineMetrics data by month and year
    const groupedMetrics = _.groupBy(timelineMetrics, (metric) => {
      const month = metric.getDataValue('month');
      const year = metric.getDataValue('year');
      return `${year}-${String(month).padStart(2, '0')}`;
    });

    // Iterate through the grouped data and create the desired format
    for (const [date, metrics] of Object.entries(groupedMetrics)) {
      const [year, month] = date.split('-');

      const formattedMetrics = {
        date: `${monthNames[parseInt(month, 10) - 1]} ${year}`,
        metrics: {
          open_tasks: 0,
          inprogress_tasks: 0,
          completed_tasks: 0,
        },
      };

      // Populate the metrics for each status
      metrics.forEach((metric) => {
        const status = metric.getDataValue('status');
        const count = metric.getDataValue('count');
        formattedMetrics.metrics[`${status}_tasks`] = count;
      });

      timelineData.push(formattedMetrics);
    }

    // Respond with the formatted timeline data
    res.json(timelineData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve task metrics' });
  }
});

// Start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
