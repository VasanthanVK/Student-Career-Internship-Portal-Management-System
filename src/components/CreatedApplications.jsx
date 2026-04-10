import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import useFetch from "@/hooks/usefetch";
import { getApplications } from "@/api/apiApplications";
import BarLoader from "./ui/BarLoader";
import Applicationcard from "./Application_card";

const CreatedApplications = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
    error: errorApplications,
  } = useFetch(getApplications, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) fnApplications();
  }, [isLoaded]);

  if (!isLoaded || loadingApplications) {
    return <BarLoader loading={true} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {errorApplications && (
        <p className="text-red-500">Error: {errorApplications.message}</p>
      )}
      {applications?.length ? (
        applications.map((application) => (
          <Applicationcard
            key={application.id}
            application={application}
            isCandidate
          />
        ))
      ) : (
        <div>No Applications Found 😢</div>
      )}
    </div>
  );
};

export default CreatedApplications;
