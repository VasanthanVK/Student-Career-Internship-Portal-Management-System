import BarLoader from '@/components/ui/BarLoader'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveAdminToTable } from '@/api/apiAdmin'
import useFetch from '@/hooks/usefetch'


const Onboard = () => {

  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  const { fn: fnSaveAdmin } = useFetch(saveAdminToTable)

  const navigateUser = (currRole) => {
    if (currRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate(currRole === "recruiter" ? "/profile" : "/job");
    }
  };

  const handleRoleSelection = async (role) => {
    try {
      await user.update({
        unsafeMetadata: { role },
      })

      // If admin, save to Supabase admin table
      if (role === "admin") {
        await fnSaveAdmin({
          user_id: user.id,
          name: user.fullName || user.firstName || "Admin",
          email: user.primaryEmailAddress?.emailAddress,
        });
      }

      navigateUser(role)
    }
    catch (err) {
      console.error("error updating role:", err);
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      // Hardcoded Admin Email Check
      const adminEmail = "vasanthanvk11@gmail.com";
      if (user.primaryEmailAddress?.emailAddress === adminEmail && user.unsafeMetadata.role !== "admin") {
        handleRoleSelection("admin");
        return;
      }

      if (user?.unsafeMetadata.role) {
        navigateUser(user.unsafeMetadata.role)
      }
    }
  }, [isLoaded, user])

  if (!isLoaded) {
    return (
      <BarLoader loading={true} />
    )
  }

  return (
    <div className='flex flex-col items-center justify-center mt-32'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>I am a..</h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button variant='blue' className='h-36 text-2xl' onClick={() => handleRoleSelection('candidate')}>Candidate</Button>
        <Button variant='destructive' className='h-36 text-2xl' onClick={() => handleRoleSelection('recruiter')}>Recruiter</Button>
      </div>
    </div>
  )
}

export default Onboard;
