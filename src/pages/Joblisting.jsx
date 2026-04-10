import { getJobs } from "@/api/apijobs";
import BarLoader from "@/components/ui/BarLoader";
import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import Jobcard from "@/components/Jobcard";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Search, MapPin, Building, X } from "lucide-react";

const Joblisting = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchquery, setSearchquery] = useState("");
  const { isLoaded } = useUser();
  const [states, setStates] = useState([]);

  const clearFilter = () => {
    setSearchquery("");
    setCompany_id("");
    setLocation("");
  };

  useEffect(() => {
    axios
      .post("https://countriesnow.space/api/v0.1/countries/states", {
        country: "India",
      })
      .then((res) => {
        setStates(res.data.data.states);
      });
  }, []);

  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchquery,
  });
  const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchquery]);

  if (!isLoaded) {
    return <BarLoader loading={true} />;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query !== null) setSearchquery(query);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl mb-4">
          Latest Internships
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore the best internship opportunities from top companies and start your career journey.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative group"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search size={20} />
          </div>
          <Input
            type="text"
            placeholder="Search Internships by title, skills, or keywords..."
            name="search-query"
            defaultValue={searchquery}
            className="h-16 pl-12 pr-32 text-lg bg-card/40 backdrop-blur-md border-border/50 focus:ring-2 focus:ring-primary/20 transition-all rounded-2xl"
          />
          <Button 
            type="submit" 
            className="absolute right-2 top-2 h-12 px-8 rounded-xl font-bold shadow-lg"
            variant="default"
          >
            Search
          </Button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
               <Select value={location} onValueChange={(value) => setLocation(value)}>
                <SelectTrigger className="h-12 bg-card/40 border-border/50 rounded-xl pl-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary"/>
                    <SelectValue placeholder="All Locations" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((s, index) => (
                      <SelectItem key={index} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative">
              <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
                <SelectTrigger className="h-12 bg-card/40 border-border/50 rounded-xl pl-4">
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-primary"/>
                    <SelectValue placeholder="All Companies" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id.toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(location || company_id || searchquery) && (
            <Button
              onClick={clearFilter}
              variant="ghost"
              className="h-12 px-6 text-destructive hover:bg-destructive/10 rounded-xl gap-2 font-semibold"
            >
              <X size={18} /> Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="mt-12">
        {loadingJobs && <BarLoader loading={true} />}
        
        {!loadingJobs && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Jobs?.length ? (
              Jobs.map((Job) => (
                <Jobcard
                  key={Job.id}
                  job={Job}
                  savedInit={Job.saved?.length > 0}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-card/20">
                <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Search size={40} className="text-primary/40"/>
                </div>
                <h3 className="text-2xl font-bold mb-2">No Internships Found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search keywords to find more opportunities.</p>
                <Button variant="outline" className="mt-6" onClick={clearFilter}>View All Internships</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Joblisting;
