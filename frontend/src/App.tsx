import { Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { HomePage } from './pages/HomePage'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { AssignmentDetailsPage } from './pages/AssignmentDetailsPage'
import { NewAssignmentPage } from './pages/NewAssignmentPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="assignments/new" element={<NewAssignmentPage />} />
        <Route path="assignments/:id" element={<AssignmentDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}