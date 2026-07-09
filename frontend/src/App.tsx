import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProjectsListPage } from '@/routes/ProjectsListPage'
import { ProjectBoardPage } from '@/routes/ProjectBoardPage'
import { NotFoundPage } from '@/routes/NotFoundPage'
import { LoginPage } from '@/routes/LoginPage'
import { RequireAuth } from '@/routes/RequireAuth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<ProjectsListPage />} />
          <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
