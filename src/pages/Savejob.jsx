import { getSavedJobs } from '@/api/apijobs';
import { getApplicationsForRecruiter } from '@/api/apiApplications';
import Jobcard from '@/components/Jobcard';
import Applicationcard from '@/components/Application_card';
import BarLoader from '@/components/ui/BarLoader';
import useFetch from '@/hooks/usefetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { LayoutDashboard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Savejob = () => {
  const { isLoaded, user } = useUser();
  const [selectedJobTitle, setSelectedJobTitle] = React.useState("all");
  const role = user?.unsafeMetadata?.role?.toLowerCase();

  // Candidate: Saved Jobs
  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  // Recruiter: Received Applications
  const {
    loading: loadingRecruiterApplications,
    data: recruiterApplications,
    fn: fnRecruiterApplications,
  } = useFetch(getApplicationsForRecruiter, {
    recruiter_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) {
      if (role === 'recruiter') {
        fnRecruiterApplications();
      } else {
        fnSavedJobs();
      }
    }
  }, [isLoaded, role]);

  if (!isLoaded) {
    return <BarLoader loading={true} />;
  }

  const isRecruiter = role === 'recruiter';

  const uniqueJobTitles = Array.from(new Set(recruiterApplications?.map(app => app.job?.title).filter(Boolean)));

  const filteredApplications = selectedJobTitle === "all" 
    ? recruiterApplications 
    : recruiterApplications?.filter(app => app.job?.title === selectedJobTitle);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {isRecruiter ? "Applications Received" : "Saved Internships"}
      </h1>

      {isRecruiter ? (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-card/40 backdrop-blur-md p-4 rounded-2xl border border-border/50">
             <div className="flex items-center gap-3">
                <LayoutDashboard className="text-primary"/>
                <span className="font-bold text-lg">Filter Applications</span>
             </div>
             <Select value={selectedJobTitle} onValueChange={setSelectedJobTitle}>
                <SelectTrigger className="w-[280px] bg-background/50 h-10">
                  <SelectValue placeholder="Filter by Internship Title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Internships</SelectItem>
                  {uniqueJobTitles.map((title) => (
                    <SelectItem key={title} value={title}>{title}</SelectItem>
                  ))}
                </SelectContent>
             </Select>
          </div>

          {(loadingRecruiterApplications) ? (
            <BarLoader loading={true} />
          ) : (
             <div className="flex flex-col gap-4">
               {filteredApplications?.length ? (
                 filteredApplications.map((application) => (
                    <Applicationcard 
                      key={application.id} 
                      application={application} 
                      isCandidate={false} 
                    />
                 ))
               ) : (
                 <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-card/20">
                   <h3 className="text-2xl font-bold mb-2">
                     {selectedJobTitle === "all" ? "No Applications Yet 📥" : `No Applications for "${selectedJobTitle}"`}
                   </h3>
                   <p className="text-muted-foreground">
                     {selectedJobTitle === "all" 
                       ? "When candidates apply to your internships, they will appear here." 
                       : "Try adjusting your filter to see more candidates."}
                   </p>
                 </div>
               )}
             </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {loadingSavedJobs ? (
            <BarLoader loading={true} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedJobs?.length ? (
                savedJobs?.map((saved) => (
                  <Jobcard
                    key={saved.id}
                    job={saved?.job}
                    onJobAction={fnSavedJobs}
                    savedInit={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-card/20">
                   <h3 className="text-2xl font-bold mb-2">No Saved Internships 👀</h3>
                   <p className="text-muted-foreground">Internships you heart will show up here for quick access.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Savejob;
