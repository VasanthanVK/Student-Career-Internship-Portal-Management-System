import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox, Users } from "lucide-react";
import ReportDialog from "@/components/ReportDialog";
import { ModeToggle } from "@/components/ModeToggle";


const Header = () => {
  const [showSignin,setShowSignin]=useState(false);
  const {user}=useUser();

   const [search, setSearch] = useSearchParams();
    useEffect(() => {
    if(search.get("sign-in")) {
      setShowSignin(true)
    }
  }, [search]);


 const handleOverlayClick =(e)=>{
  if(e.target === e.currenTarget){
    setShowSignin(false);
    setSearch({})
  }
 }
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to='/'>
          <img src="/logo.png" className="h-20" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant="outline" onClick={()=>setShowSignin(true)}>Login</Button>
          </SignedOut>
          {/* {add a condition} */}
          <SignedIn> 
            {/* Recruiter nav */}
            {user?.unsafeMetadata?.role === "recruiter" && (
              <div className="flex gap-4">
                <Link to={'/profile'}>
                  <Button variant="outline" className='rounded-full'><Users className="mr-2" size={20}/>Browse Candidates</Button>
                </Link>
                <Link to={'/postjob'}>
                  <Button variant="destructive" className='rounded-full'><PenBox className="mr-2" size={20}/>Post job</Button>
                </Link>
              </div>
            )}

            {/* Admin nav — only dashboard link */}
            {user?.unsafeMetadata?.role === "admin" && (
              <Link to={'/admin-dashboard'}>
                <Button variant="outline" className='rounded-full'>Admin Dashboard</Button>
              </Link>
            )}

            {/* Report button — candidates and recruiters only */}
            {user?.unsafeMetadata?.role !== "admin" && <ReportDialog />}

            {/* UserButton — admin gets minimal menu */}
            {user?.unsafeMetadata?.role === "admin" ? (
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
            ) : (
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }}>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Internships"
                    labelIcon={<BriefcaseBusiness size={15}/>}
                    href="/myjob"
                  />
                  {user?.unsafeMetadata?.role === "recruiter" && (
                    <UserButton.Link
                      label="Browse Candidates"
                      labelIcon={<Users size={15}/>}
                      href="/candidates"
                    />
                  )}
                  <UserButton.Link
                    label={user?.unsafeMetadata?.role === "recruiter" ? "Recruiter Profile" : "Candidate Profile"}
                    labelIcon={user?.unsafeMetadata?.role === "recruiter" ? <BriefcaseBusiness size={15}/> : <Heart size={15}/>}
                    href="/profile"
                  />
                  <UserButton.Link 
                    label={user?.unsafeMetadata?.role === "recruiter" ? "Applications Received" : "Saved Internships"}
                    labelIcon={user?.unsafeMetadata?.role === "recruiter" ? <BriefcaseBusiness size={15}/> : <Heart size={15}/>}
                    href='/savejob'
                  />
                  </UserButton.MenuItems>
                </UserButton>
              )}
            </SignedIn>
            <ModeToggle />
          </div>
        </nav>
      {showSignin && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
        <SignIn
        signUpForceRedirectUrl="/onboard"
        fallbackRedirectUrl="/onboard"
        />
        </div>}
    </>
  );
};

export default Header
