import { getSingleJob, updateHiringStatus } from "@/api/apijobs";
import { getCandidateProfile } from "@/api/apiCandidate";
import Applicationcard from "@/components/Application_card";
import ApplyJobDrawer from "@/components/Applyjob.jsx";
import BarLoader from "@/components/ui/BarLoader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Job = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const {
    loading: loadingProfile,
    data: candidateProfile,
    fn: fnProfile,
  } = useFetch(getCandidateProfile, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) {
      fnJob();
      // Fetch candidate profile to auto-fill apply form
      const role = user?.unsafeMetadata?.role?.toLowerCase();
      if (role !== "recruiter") {
        fnProfile();
      }
    }
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    },
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader loading={true} />;
  }
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length} Applications
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen />
              Open
            </>
          ) : (
            <>
              <DoorClosed />
              Closed
            </>
          )}
        </div>
      </div>
      {/* hiring status */}
      {loadingHiringStatus && <BarLoader loading={true} />}

      {job?.recruiter_id == user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"} `}
          >
            <SelectValue
              placeholder={
                "hiring Status " + (job?.isOpen ? "(open)" : "(closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold">About the Internship</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirement}
        className=" bg-transparent sm:text-lg "
      />

      {/* render applications */}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          Job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find(
            (ap) => ap.candidate_id === user?.id,
          )}
          candidateProfile={candidateProfile}
        />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id == user?.id && (
        <div className="flex flex-col gap-2">
          <h2>Applications</h2>
          {job?.applications.map((application) => {
            return (
              <Applicationcard 
                key={application.id} 
                application={{ ...application, job }} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Job;

//timing 3.1.8 post job
