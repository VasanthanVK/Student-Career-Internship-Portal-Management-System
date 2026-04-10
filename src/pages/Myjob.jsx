import BarLoader from '@/components/ui/BarLoader';
import { useUser } from '@clerk/clerk-react';
import React from 'react'
import CreatedApplications from '@/components/CreatedApplications';
import CreateJobs from '@/components/CreateJobs';

const Myjob = () => {
  const { user, isLoaded } = useUser();

   if (!isLoaded) {
    return <BarLoader loading={true} />;
  }
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-12">
       {user?.unsafeMetadata?.role === "Candidate"
          ? "My Applications"
          : "My Internships"}
      </h1>
      
      <div className="max-w-7xl mx-auto">
        {user?.unsafeMetadata?.role === "Candidate" ? (
          <CreatedApplications />
        ) : user?.unsafeMetadata?.role === "recruiter" ? (
          <CreateJobs />
        ) : (
          <div className="text-center mt-20 p-10 border border-dashed border-border rounded-2xl bg-card/30">
            <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
            <p className="text-muted-foreground">Please onboard as a Candidate or Recruiter first to see your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Myjob
