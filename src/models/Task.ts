import { Schema, model } from 'mongoose'
import { taskStatus } from '@src/types/types'

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: taskStatus,
    default: 'pending',
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
})

const Task = model('Task', taskSchema)

export default Task
