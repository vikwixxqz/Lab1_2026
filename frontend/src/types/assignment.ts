export type AssignmentStatus = 'todo' | 'in_progress' | 'done'

export type Assignment = {
  id: string
  title: string
  description: string
  status: AssignmentStatus
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  course: string
}

export type AssignmentDraft = Omit<Assignment, 'id'>