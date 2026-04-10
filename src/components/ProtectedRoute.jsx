import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {

  const { isSignedIn, isLoaded, user } = useUser()
  const { pathname } = useLocation();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" replace />;
  }

  // If no role yet and not on onboard, send to onboard
  if (!user?.unsafeMetadata?.role && pathname !== "/onboard") {
    return <Navigate to='/onboard' replace />
  }

  // Admin can ONLY access /admin-dashboard — redirect everything else
  if (user?.unsafeMetadata?.role === "admin" && pathname !== "/admin-dashboard") {
    return <Navigate to='/admin-dashboard' replace />
  }

  // Non-admins cannot access admin dashboard
  if (user?.unsafeMetadata?.role !== "admin" && pathname === "/admin-dashboard") {
    return <Navigate to='/job' replace />
  }

  return children
}

export default ProtectedRoute
