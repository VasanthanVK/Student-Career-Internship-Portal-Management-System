import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Boxes, BriefcaseBusiness, Download, School } from 'lucide-react'
import { updateApplicationStatus } from '@/api/apiApplications';
import useFetch from '@/hooks/usefetch';
import BarLoader from './ui/BarLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { sendStatusUpdateEmail } from '@/Utils/EmailService';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Applicationcard = ({application,isCandidate=false}) => {
     const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.id,
    }
  );

   const {user}=useUser()
  const handleStatusChange = (newStatus) => {
    fnHiringStatus(newStatus)
    .then((data) => {
        if (data) {
          
          // Call Backend Nodemailer API
          axios.put("http://localhost:3000/api/application/status", {
            status: newStatus,
            candidateName: application.name || user?.fullName || "Candidate",
            candidateEmail: application.email || user?.primaryEmailAddress?.emailAddress,
            jobTitle: application.job?.title,
            companyName: application.job?.company?.name,
            companyLogo: application.job?.company?.logo_url,
          }).then((response) => {
            if (response.data.success) {
            } else {
              console.error("⚠️ Backend Email reported failure:", response.data.message);
            }
          }).catch(err => {
            console.error("❌ Backend Email Failed (Is the server running?):", err.message);
          });

          // Optional: Still send EmailJS for redundancy (or remove if preferred)
          // sendStatusUpdateEmail({ ... }); 
        } else {
          console.error("❌ Database update returned no rows. Email not sent.");
        }
    })
    .catch((err) => {
        console.error("❌ Failed to update status in database:", err);
    });
  };

  return (
   <Card>
    {loadingHiringStatus && <BarLoader loading={true} />}
    <CardHeader>
        <CardTitle className="flex justify-between font-bold">
            {isCandidate ? (
              `${application?.job?.title} at ${application?.job?.company?.name}`
            ) : (
                <div className="flex flex-col">
                    <span>{application?.name}</span>
                    <span className="text-sm font-normal text-muted-foreground mt-1">
                        Applied for: <span className="font-semibold text-primary">{application?.job?.title}</span>
                    </span>
                </div>
            )}
             <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer shadow-md hover:bg-gray-100 transition-colors"
            onClick={handleDownload}
          />
        </CardTitle>
    </CardHeader>
     <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
       <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="offer_letter">Offer Letter</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>

   </Card>
  )
}

export default Applicationcard
