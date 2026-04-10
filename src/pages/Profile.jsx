import React, { useEffect, useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Briefcase, FileText, Settings, Building2, Users, PieChart, PenBox, Search, Heart, LayoutDashboard, LogOut, UserCheck, Edit3 } from 'lucide-react';
import useFetch from '@/hooks/usefetch';
import { getMyJobs, getSavedJobs } from '@/api/apijobs';
import { getApplications } from '@/api/apiApplications';
import { getCandidateProfile, updateCandidateProfile } from '@/api/apiCandidate';
import BarLoader from '@/components/ui/BarLoader';
import CandidateProfileForm from '@/components/CandidateProfileForm';

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const role = user?.unsafeMetadata?.role?.toLowerCase();
  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Recruiter Data
  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user?.id,
  });

  // Candidate Data
  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user?.id,
  });

  const {
    loading: loadingSaved,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  const {
    loading: loadingProfile,
    data: candidateProfile,
    fn: fnProfile,
  } = useFetch(getCandidateProfile, {
    user_id: user?.id,
  });

  const {
    loading: updatingProfile,
    fn: fnUpdateProfile,
  } = useFetch(updateCandidateProfile);

  useEffect(() => {
    if (isLoaded) {
      if (role === 'recruiter') {
        fnJobs();
      } else {
        fnApplications();
        fnSavedJobs();
        fnProfile();
      }
    }
  }, [isLoaded, role]);

  const handleProfileUpdate = async (data) => {
    try {
      await fnUpdateProfile({ ...data, user_id: user.id });
      setShowProfileForm(false);
      fnProfile(); // Refresh profile data
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (!isLoaded) return <BarLoader loading={true} />;

  const totalApplications = jobs?.reduce((acc, job) => acc + (job.applications?.length || 0), 0) || 0;
  const totalShortlisted = jobs?.reduce((acc, job) => 
    acc + (job.applications?.filter(app => app.status === 'shortlisted').length || 0), 0) || 0;

  const CandidateView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 h-fit bg-card/60 backdrop-blur-md border-border/50">
            <CardHeader className="items-center pb-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <CardTitle className="text-xl font-bold">{user?.fullName}</CardTitle>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Candidate</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
                  <Mail size={16} className="text-primary"/>
                  <span className="truncate">{candidateProfile?.email || user?.primaryEmailAddress?.emailAddress}</span>
               </div>
               <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
                  <Briefcase size={16} className="text-primary"/>
                  <span>{candidateProfile?.location || "Location not set"}</span>
               </div>
               <Button 
                variant={showProfileForm ? "default" : "outline"} 
                className="w-full mt-4 flex items-center gap-2"
                onClick={() => setShowProfileForm(!showProfileForm)}
               >
                  <Edit3 size={16}/> {showProfileForm ? "View Dashboard" : "Update Profile"}
               </Button>
               <Link to="/myjob" className="w-full">
                <Button variant="outline" className="w-full mt-2 flex items-center gap-2">
                  <Briefcase size={16}/> My Applications
                </Button>
               </Link>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card/60 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {showProfileForm ? (
                  <><UserCheck className="text-primary"/> Professional Profile</>
                ) : (
                  <><LayoutDashboard className="text-primary"/> Candidate Dashboard</>
                )}
              </CardTitle>
              <CardDescription>
                {showProfileForm 
                  ? "Update your professional details to stand out to recruiters." 
                  : "Track your internship applications and saved opportunities."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {showProfileForm ? (
                <CandidateProfileForm 
                  initialData={candidateProfile || { name: user.fullName, email: user.primaryEmailAddress.emailAddress }}
                  onSubmit={handleProfileUpdate}
                  loading={updatingProfile}
                />
              ) : (
                <>
                  {(loadingApplications || loadingSaved || loadingProfile) ? (
                    <BarLoader loading={true} />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                       <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all">
                          <p className="text-4xl font-extrabold text-primary">{applications?.length || 0}</p>
                          <p className="text-sm text-muted-foreground uppercase font-bold mt-2 tracking-wide">Applied Internships</p>
                       </div>
                       <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all">
                          <p className="text-4xl font-extrabold text-primary">{savedJobs?.length || 0}</p>
                          <p className="text-sm text-muted-foreground uppercase font-bold mt-2 tracking-wide">Saved Internships</p>
                       </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t border-border/30">
                     <div className="flex justify-between items-center">
                        <Label className="text-lg font-bold">Quick Shortcuts</Label>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/savejob">
                          <Button variant="secondary" className="w-full h-12 gap-2">
                            <Heart size={18} className="text-red-500"/> View Saved
                          </Button>
                        </Link>
                        <Link to="/myjob">
                          <Button variant="secondary" className="w-full h-12 gap-2">
                            <Briefcase size={18}/> View Applications
                          </Button>
                        </Link>
                     </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-4 pt-6">
                 <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 border-none hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
                    onClick={handleSignOut}
                 >
                   <LogOut size={18}/> Sign Out
                 </Button>
                 <Link to="/job">
                    <Button variant="default" size="lg" className="px-10 font-bold shadow-lg shadow-primary/20">
                      Explore More
                    </Button>
                 </Link>
              </div>
            </CardContent>
          </Card>
        </div>
  );

  const RecruiterView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 h-fit bg-card/60 backdrop-blur-md border-border/50">
             <CardHeader className="items-center pb-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-destructive/20 mb-4">
                <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <CardTitle className="text-xl font-bold">{user?.fullName}</CardTitle>
              <p className="text-sm text-destructive uppercase tracking-widest font-semibold">Recruiter / Employer</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
               <div className="flex items-center gap-3 text-sm">
                  <Building2 size={16} className="text-destructive"/>
                  <span>Hiring Manager</span>
               </div>
               <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-destructive"/>
                  <span className="truncate">{user?.primaryEmailAddress?.emailAddress}</span>
               </div>
               <Link to="/postjob">
                <Button variant="destructive" className="w-full mt-4 flex items-center gap-2">
                  <PenBox size={16}/> Post Internship
                </Button>
               </Link>
               <Link to="/savejob">
                <Button variant="outline" className="w-full mt-2 flex items-center gap-2 border-destructive/20 hover:bg-destructive/5 text-destructive">
                  <Briefcase size={16}/> Application Received
                </Button>
               </Link>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card/60 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <PieChart className="text-destructive"/> Recruitment Dashboard
              </CardTitle>
              <CardDescription>Monitor your hiring activity and company stats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {loadingJobs ? (
                <BarLoader loading={true} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                   <div className="bg-secondary/20 p-4 rounded-xl border border-border/30">
                      <p className="text-3xl font-bold text-destructive">{jobs?.length || 0}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Active Posts</p>
                   </div>
                   <div className="bg-secondary/20 p-4 rounded-xl border border-border/30">
                      <p className="text-3xl font-bold text-destructive">{totalApplications}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Total Applications</p>
                   </div>
                   <div className="bg-secondary/20 p-4 rounded-xl border border-border/30">
                      <p className="text-3xl font-bold text-destructive">{totalShortlisted}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Shortlisted</p>
                   </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6">
                 <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 border-none hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
                    onClick={handleSignOut}
                 >
                   <LogOut size={18}/> Sign Out
                 </Button>
                 <Link to="/myjob">
                   <Button variant="destructive" size="lg" className="px-10 font-bold shadow-lg shadow-destructive/20">
                     Dashboard
                   </Button>
                 </Link>
              </div>
            </CardContent>
          </Card>
        </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl text-center pb-12">
          {role === 'recruiter' ? 'Recruiter Profile' : 'Candidate Profile'}
        </h1>

        {role === 'recruiter' ? <RecruiterView /> : <CandidateView />}
      </div>
    </div>
  )
}

export default Profile
