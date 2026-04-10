import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinCheck, Trash2Icon, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useFetch from '@/hooks/usefetch';
import { deleteJob, saveJob } from '@/api/apijobs';
import BarLoader from './ui/BarLoader';
import DeleteJobDialog from './DeleteJobDialog';

const Jobcard = ({
    job,
    isMyJob= false,
    savedInit= false,
    onJobAction=() =>{},}) => {
        const [saved, setSaved]=useState(savedInit)

        const { fn: fnSavedJob, data:SavedJob,loading: loadingSavedJob,} = useFetch(saveJob, {alreadysaved:saved})


        const {user}=useUser()

        const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
          job_id: job.id,
        });

        const handleDeleteJob = async () => {
          await fnDeleteJob();
          onJobAction();
        };

        const handleSavedJob=async()=>{
            await fnSavedJob({
                user_id:user.id,
                job_id:job.id,
            })
            onJobAction()
        }
        useEffect(()=>{
            if(SavedJob!==undefined) setSaved(SavedJob?.length>0)
        },[SavedJob])
  return (
    <Card className="flex flex-col overflow-hidden bg-card/60 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group">
        {loadingDeleteJob && <BarLoader loading={true}/>}
        <CardHeader className="pb-4">
            <CardTitle className='flex justify-between items-start font-bold text-2xl group-hover:text-primary transition-colors'>
              {job.title}
              {isMyJob && (
                <DeleteJobDialog 
                    onConfirm={handleDeleteJob} 
                    loading={loadingDeleteJob} 
                />
              )}
            </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-6 flex-1'>
            <div className='flex justify-between items-center flex-wrap gap-2'>
                <div className="bg-white/5 p-2 rounded-lg border border-white/10 group-hover:border-primary/20 transition-all">
                  {job.company && <img src={job.company.logo_url} className='h-8 object-contain'/>}
                </div>
                <div className='flex gap-2 flex-wrap'>
                  <div className='flex gap-2 items-center text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full text-sm font-medium'>
                      <MapPinCheck size={14} className="text-primary"/>{job.location}
                  </div>
                  <div className='flex gap-2 items-center text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full text-sm font-medium'>
                      <BriefcaseBusiness size={14} className="text-destructive"/>
                      {job?.applications?.length || 0} Applications
                  </div>
                </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                 <BriefcaseBusiness size={12}/> Description Preview
              </div>
              <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                {job?.description?.split('.')[0]}.
              </p>
            </div>
        </CardContent>
        <CardFooter className='flex gap-3 pt-4 border-t border-border/30 bg-secondary/10'>
            <Link to={`/job/${job.id}`} className='flex-1'>
              <Button 
                variant='secondary' 
                className='w-full font-bold h-11 transition-all hover:bg-primary hover:text-primary-foreground shadow-sm'
              >
                View Details
              </Button>
            </Link>

            {!isMyJob&&(
                <Button 
                  variant='outline' 
                  className={`w-12 h-11 rounded-lg transition-all ${saved ? 'border-primary/50 bg-primary/5' : 'hover:border-primary/30 hover:bg-primary/5'}`} 
                  onClick={handleSavedJob} 
                  disabled={loadingSavedJob}
                >
                    {saved ?(
                        <Heart size={20} className='text-red-500' fill='currentColor'/>):(
                        <Heart size={20} className="text-muted-foreground group-hover:text-primary transition-colors"/>
                    )}
                </Button>
            )}
        </CardFooter>
    </Card>
  )
}

export default Jobcard;
