import type { Assignment } from '../types/assignment'

export const assignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Лабораторная по React',
    description: 'Собрать каркас приложения, настроить TypeScript и опубликовать в Git.',
    status: 'done',
    dueDate: '2026-09-30',
    priority: 'high',
    course: 'web-dev',
  },
  {
    id: 'a2',
    title: 'Конспект по алгоритмам',
    description: 'Описать сортировки и структуры данных для семинара.',
    status: 'in_progress',
    dueDate: '2026-10-12',
    priority: 'medium',
    course: 'algorithms',
  },
  {
    id: 'a3',
    title: 'Эссе по истории',
    description: 'Написать работу на 5 страниц по выбранной теме.',
    status: 'todo',
    dueDate: '2026-10-20',
    priority: 'low',
    course: 'history',
  },
  {
    id: 'a4',
    title: 'Подготовка к контрольной',
    description: 'Повторить формулы и решить задачи из сборника.',
    status: 'todo',
    dueDate: '2026-10-08',
    priority: 'high',
    course: 'math',
  },
  {
    id: 'a5',
    title: 'Презентация проекта',
    description: 'Сделать слайды и короткое выступление на 5 минут.',
    status: 'in_progress',
    dueDate: '2026-10-15',
    priority: 'medium',
    course: 'web-dev',
  },
]