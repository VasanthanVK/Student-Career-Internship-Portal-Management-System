import BarLoader from '@/components/ui/BarLoader';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import AddCompanyDrawer from "@/components/addcompanydrawer";
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigate, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/usefetch';
import { getCompanies } from '@/api/apiCompanies';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { addNewJob } from '@/api/apijobs';
import axios from 'axios';
import { Label } from '@/components/ui/label';

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirement: z.string().min(1, { message: "Requirements are required" }),
});

const markdownPlaceholder = `
### Responsibilities
- Describe intern daily tasks
- Mention technologies used
- Explain project involvement
------------------------------------------
### Requirements
- Required skills (React, Node.js, etc.)
- Education qualification
- Communication skills
------------------------------------------
### Internship Details
- Duration (e.g., 3–6 Months)
- Internship Mode (Remote/Onsite)
- Stipend Information
------------------------------------------
### Benefits
- Internship Certificate
- Real-time Project Experience
- Letter of Recommendation
- Possible Job Offer
`;

const Postjob = () => {

  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [states, setStates] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirement: markdownPlaceholder,
    },
    resolver: zodResolver(schema),
  });
  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);


  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    axios
      .post("https://countriesnow.space/api/v0.1/countries/states", {
        country: "India", 
      })
      .then((res) => {
        setStates(res.data.data.states);
      });
  }, []);

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/job");
  }, [dataCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader loading={true} />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/job" />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl mb-4">
             Post an Internship
          </h1>
          <p className="text-muted-foreground text-lg">
            Reach the best candidates by providing detailed internship information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl shadow-xl space-y-8"
        >
          <div className="space-y-4">
             <div>
                <Label htmlFor="title" className="text-base font-semibold mb-2 block">Internship Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Software Engineer Intern" 
                  className="bg-background/50 h-12 text-lg focus:ring-2 focus:ring-primary/20"
                  {...register("title")} 
                />
                {errors.title && <p className="text-red-500 mt-1 text-sm">{errors.title.message}</p>}
             </div>

             <div>
                <Label htmlFor="description" className="text-base font-semibold mb-2 block">Internship Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the role, responsibilities, and team..." 
                  className="bg-background/50 min-h-[120px] text-base focus:ring-2 focus:ring-primary/20"
                  {...register("description")} 
                />
                {errors.description && (
                  <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Location</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-background/50 h-12">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {states.map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">Company</Label>
              <div className="flex gap-2">
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background/50 h-12 flex-1">
                        <SelectValue placeholder="Company">
                          {field.value
                            ? companies?.find((com) => com.id === Number(field.value))
                              ?.name
                            : "Select Company"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {companies?.filter(c => c.status === 'approved').map((company) => (
                            <SelectItem key={company.name} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <AddCompanyDrawer fetchCompanies={fnCompanies} />
              </div>
              <p className="text-xs text-muted-foreground mt-1 italic">
                 *Only verified/approved companies will appear here.
              </p>
              {errors.company_id && (
                <p className="text-red-500 text-sm">{errors.company_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Internship Requirements (Markdown)</Label>
            <div className="border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Controller
                name="requirement"
                control={control}
                render={({ field }) => (
                  <MDEditor 
                    value={field.value} 
                    onChange={field.onChange} 
                    preview="edit"
                    height={300}
                    className="bg-transparent"
                    textareaProps={{
                      placeholder: markdownPlaceholder,
                    }}
                  />
                )}
              />
            </div>
            {errors.requirement && (
              <p className="text-red-500 text-sm">{errors.requirement.message}</p>
            )}
          </div>

          {errorCreateJob?.message && (
            <p className="text-red-500 text-center font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {errorCreateJob?.message}
            </p>
          )}
          
          {loadingCreateJob && <BarLoader loading={true} />}
          
          <Button 
            type="submit" 
            variant="default" 
            size="lg" 
            className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Post Internship
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Postjob
