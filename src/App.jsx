import {Button} from './components/ui/button'
import './App.css'
import { createBrowserRouter,RouterProvider} from "react-router-dom";
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import Onboard from './pages/Onboard';
import Joblisting from './pages/Joblisting'
import Job from './pages/Job';
import Postjob from './pages/Postjob';
import Savejob from './pages/Savejob';
import Myjob from './pages/Myjob'
import Profile from './pages/Profile';
import { ThemeProvider } from './components/ui/Themeprvider';
import ProtectedRoute from './components/ProtectedRoute';
import BrowseCandidates from './pages/BrowseCandidates';
import AdminDashboard from './pages/AdminDashboard';




const router = createBrowserRouter([
   {
     element:<AppLayout/>,
     children:[
      {
        path:'/',
        element:<LandingPage/>,
      },
       {
        path:'/onboard',
        element:(
        <ProtectedRoute>
          <Onboard/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/job',
        element:(
        <ProtectedRoute>
          <Joblisting/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/job/:id',
        element:(
        <ProtectedRoute>
          <Job/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/postjob',
        element:(
        <ProtectedRoute>
          <Postjob/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/savejob',
        element:(
        <ProtectedRoute>
          <Savejob/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/candidates',
        element:(
        <ProtectedRoute>
          <BrowseCandidates/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/myjob',
        element:(
        <ProtectedRoute>
          <Myjob/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/profile',
        element:(
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>
        ),
      },
       {
        path:'/admin-dashboard',
        element:(
        <ProtectedRoute>
          <AdminDashboard/>
        </ProtectedRoute>
        ),
      },
     ],
    }
  ]);


function App() {

  return <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
     <RouterProvider router={router}/>
  </ThemeProvider>
 
  
}

export default App;
