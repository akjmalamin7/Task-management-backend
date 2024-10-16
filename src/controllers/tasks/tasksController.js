const TasksModel = require("../../models/tasks/tasksModel");

exports.createTask = async (req, res) => {
  let { _id, email } = req.user;
  let reqBody = req.body;
  try {
    if (!email) {
      return req.status(400).json({
        status: "Failed",
        message: "Access forbidden.",
      });
    }
    const task = new TasksModel(reqBody);
    task.email = email;
    await task.save();
    res.status(201).json({
      status: "Success",
      message: "Task created successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Task do not create.",
    });
  }
};
exports.taskList = async (req, res) => {
  let email = req.user.email;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", message: "Access forbidden." });
    }
    let result = await TasksModel.find({ email });
    res.status(200).json({
      status: "Success",
      message: "Successfully find all tasks.",
      data: result,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "failed", message: "Task not found." });
  }
};
exports.viewTask = async (req, res) => {
  let email = req.user.email;
  let { id } = req.params;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", message: "Access forbidden." });
    }
    if (!id) {
      return res
        .status(400)
        .json({ status: "failed", message: "Task id not found" });
    }
    let result = await TasksModel.findById(id);
    res.status(200).json({
      status: "Success",
      message: "Successfully find task.",
      data: result,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "failed", message: "Task Id not found." });
  }
};
exports.updateTask = async (req, res) => {
  let reqBody = req.body;
  let { id } = req.params;
  let email = req.user.email;
  try {
    if (!email) {
      return req.status(400).json({
        status: "Failed",
        message: "Access forbidden.",
      });
    }
    if (!id) {
      return req.status(400).json({
        status: "Failed",
        message: "Task id not found",
      });
    }
    const task = await TasksModel.findByIdAndUpdate(id, reqBody, { new: true });
    res.status(200).json({
      status: "Success",
      message: "Successfully updated.",
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Task id not found.",
    });
  }
};
exports.deleteTask = async (req, res) => {
  let { id } = req.params;
  let email = req.user.email;
  try {
    if (!email) {
      return req.status(400).json({
        status: "Failed",
        message: "Access forbidden.",
      });
    }
    if (!id) {
      return req.status(400).json({
        status: "Failed",
        message: "Task id not found",
      });
    }
    const task = await TasksModel.findByIdAndDelete(id);
    res.status(200).json({
      status: "Success",
      message: "Successfully deleted.",
      data: {
        title: task.title,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Task id didn't found.",
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  let status = req.params.status;
  let email = req.user.email;
  try {
    const tasks = await TasksModel.aggregate([
      { $match: { email: email, status: status } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createDate: {
            $dateToString: {
              date: "$createDate",
              format: "%d-%m-%Y",
            },
          },
        },
      },
    ]);
    if (!tasks.length) {
      return res.status(404).json({
        status: "Failed",
        message: "No tasks found with the given status",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Tasks found",
      data: tasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Error occurred while fetching tasks",
    });
  }
};
exports.updateTaskByStatus = async (req, res) => {
  let _id = req.params.id; // Task ID
  let email = req.user.email; // Logged-in user's email
  let status = req.body.status; // New status to update

  try {
    if (!email) {
      return res.status(400).json({
        status: "Failed",
        message: "Access forbidden.",
      });
    }

    if (!_id) {
      return res.status(400).json({
        status: "Failed",
        message: "Task ID not found.",
      });
    }

    let update = await TasksModel.updateOne(
      { _id: _id, email: email },
      { status: status }
    );

    if (update.nModified === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No task found or status unchanged.",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Task status updated successfully.",
      data: update,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Error occurred while updating task status.",
    });
  }
};

exports.listTaskByStatus = async (req, res) => {
  let status = req.params.status;
  let email = req.user.email;

  try {
    const tasks = await TasksModel.aggregate([
      {
        $match: {
          email: email,
          status: status,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          dueDate: 1,
          createdDate: {
            $dateToString: {
              date: { $ifNull: ["$createDate", new Date()] }, // Default to the current date if createDate is null
              format: "%d-%m-%Y",
            },
          },
        },
      },
    ]);

    if (!tasks.length) {
      return res.status(404).json({
        status: "Failed",
        message: "No tasks found with the given status",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Error occurred while fetching tasks",
    });
  }
};

exports.taskStatusCount = async (req, res) => {
  let email = req.user.email;
  try {
    if (!email) {
      return res.status(400).json({
        status: "Failed",
        message: "Access forbidden.",
      });
    }

    // Aggregation pipeline to count tasks based on their status
    let statusCounts = await TasksModel.aggregate([
      { $match: { email: email } }, // Filter tasks by logged-in user's email
      { $group: { _id: "$status", count: { $sum: 1 } } }, // Group by status and count each
    ]);

    // Check if any tasks are found
    if (statusCounts.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No tasks found with the given status",
      });
    }

    res.status(200).json({
      status: "Success",
      data: statusCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Failed",
      message: "Error occurred while fetching task status count.",
    });
  }
};
