import { createBrowserRouter } from 'react-router-dom'
import HomePage  from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import JoinPage  from './pages/JoinPage'
import RoomPage  from './pages/RoomPage'

export const router = createBrowserRouter([
  { path: '/',              element: <HomePage />  },
  { path: '/admin',         element: <AdminPage /> },
  { path: '/join',          element: <JoinPage />  },
  { path: '/room/:roomId',  element: <RoomPage />  },
])
