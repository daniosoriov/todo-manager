export const taskStatus = ['pending', 'in-progress', 'completed'] as const

export type TaskStatus = typeof taskStatus[number]
