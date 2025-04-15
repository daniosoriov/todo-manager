import express from 'express'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import supertest from 'supertest'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'

import createTask from '@src/api/v1.0/task/createTask'
import fieldValidation from '@src/middleware/fieldValidation'
import createTaskValidators from '@src/validators/createTaskValidators'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task'

describe('Create Task Integration Success', () => {
  app.post(path, createTaskValidators, fieldValidation, createTask)

  beforeEach(async () => {
    await connectInMemoryDB()
  })

  afterEach(async () => {
    await disconnectInMemoryDB()
  })

  it('should create a task successfully', async () => {
    const payload = {
      title: 'Test task',
      description: 'Test task description',
      status: 'pending',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const taskCreateSpy = vi.spyOn(Task, 'create')
    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    const newTask = response.body
    expect(newTask).toHaveProperty('_id')
    expect(newTask).toHaveProperty('title', payload.title)
    expect(newTask).toHaveProperty('description', payload.description)
    expect(newTask).toHaveProperty('status', payload.status)
    expect(newTask).toHaveProperty('dueDate', payload.dueDate)
    expect(taskCreateSpy).toHaveBeenCalledWith(payload)
  })

  it('should create a task even with no description', async () => {
    const payload = {
      title: 'Test task',
      status: 'pending',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const taskCreateSpy = vi.spyOn(Task, 'create')
    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    const newTask = response.body
    expect(newTask).toHaveProperty('_id')
    expect(newTask.description).toBeUndefined()
    expect(taskCreateSpy).toHaveBeenCalledWith(payload)
  })

  it('should create a task even with no status', async () => {
    const payload = {
      title: 'Test task',
      description: 'Test task description',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const taskCreateSpy = vi.spyOn(Task, 'create')
    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    const newTask = response.body
    expect(newTask).toHaveProperty('_id')
    expect(newTask).toHaveProperty('status', 'pending')
    expect(taskCreateSpy).toHaveBeenCalledWith({ ...payload, status: 'pending' })
  })

  it('should create a task even with no description and status', async () => {
    const payload = {
      title: 'Test task',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const taskCreateSpy = vi.spyOn(Task, 'create')
    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    const newTask = response.body
    expect(newTask).toHaveProperty('_id')
    expect(newTask.description).toBeUndefined()
    expect(newTask).toHaveProperty('status', 'pending')
    expect(taskCreateSpy).toHaveBeenCalledWith({ ...payload, status: 'pending' })
  })
})

describe('Create Task Integration Fail', () => {
  it('should fail when no title is provided', async () => {
    const response = await supertest(app).post(path).send({ description: 'Test task' })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    const found = response.body.errors.some((error: any) => error.path === 'title' && error.location === 'body')
    expect(found).toBe(true)
  })

  it('should fail when no dueDate is provided', async () => {
    const response = await supertest(app).post(path).send({ title: 'Test task' })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    const found = response.body.errors.some((error: any) => error.path === 'dueDate' && error.location === 'body')
    expect(found).toBe(true)
  })
})
