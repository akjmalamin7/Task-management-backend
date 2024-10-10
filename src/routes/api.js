const {
  createTask,
  taskList,
  updateTask,
  deleteTask,
  viewTask,
  listTaskByStatus,
  updateTaskByStatus,
  taskCount,
  myTaskCount,
  taskStatusCount,
} = require("../controllers/tasks/tasksController");
const {
  createProfile,
  login,
  updateProfile,
  profileDetails,
} = require("../controllers/users/usersController");
const authMiddleware = require("../middleware/AuthMiddleware");

const router = require("express").Router();

router.post("/registration", createProfile);
router.post("/login", login);
router.patch("/profile/update", authMiddleware, updateProfile);
router.get("/profile", authMiddleware, profileDetails);

/* task */
router.post("/tasks/create", authMiddleware, createTask);
router.get("/tasks/list", authMiddleware, taskList);
router.get("/tasks/view/:id", authMiddleware, viewTask);
router.patch("/tasks/:id", authMiddleware, updateTask);
router.delete("/tasks/:id", authMiddleware, deleteTask);

router.get("/tasks/list/:status", authMiddleware, listTaskByStatus);
router.put("/tasks/:id/status", authMiddleware, updateTaskByStatus);
router.get("/tasks/status-count", authMiddleware, taskStatusCount);
module.exports = router;
