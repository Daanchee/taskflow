import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProjectsListPage } from '@/routes/ProjectsListPage'
import { ProjectBoardPage } from '@/routes/ProjectBoardPage'
import { NotFoundPage } from '@/routes/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<ProjectsListPage />} />
        <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
