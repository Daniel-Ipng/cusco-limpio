import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout