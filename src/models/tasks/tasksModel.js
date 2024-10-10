const { Schema, model } = require("mongoose");
const TasksSchemaModel = new Schema(
  {
    email: { type: String, require: true },
    title: { type: String, require: true },
    description: { type: String, require: true },
    status: { type: String, require: true },
    createdDate: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
const TasksModel = model("Tasks", TasksSchemaModel);
module.exports = TasksModel;
