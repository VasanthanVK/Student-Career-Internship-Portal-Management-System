import { useEffect } from "react";
import useFetch from "@/hooks/usefetch";
import { getMyJobs } from "@/api/apijobs";
import { useUser } from "@clerk/clerk-react";
import Jobcard from "./Jobcard";
import BarLoader from "./ui/BarLoader";

const CreateJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  // useEffect(() => {
  //   if (isLoaded) fnJobs();
  // }, [isLoaded]);
  useEffect(() => {
    fnJobs();
  }, []);

  return (
     <div>
      {loadingJobs ? (
        <BarLoader loading={true} />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <Jobcard
                  key={job.id}
                  job={job}
                  onJobAction={fnJobs}
                  isMyJob
                />
              );
            })
          ) : (
            <div>No Internships Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateJobs;