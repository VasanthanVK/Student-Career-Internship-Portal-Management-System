import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Mail, MapPin, Award, FileText, User } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  headlines: z.string().min(5, "Headline must be at least 5 characters"),
  location: z.string().min(2, "Location is required"),
  skills: z.string().min(1, "Please enter at least one skill"),
  resume: z.any().optional(),
});

const CandidateProfileForm = ({ initialData, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      headlines: initialData?.headlines || "",
      location: initialData?.location || "",
      skills: Array.isArray(initialData?.skills) ? initialData.skills.join(", ") : initialData?.skills || "",
    },
  });

  useEffect(() => {
     if (initialData) {
        reset({
            name: initialData.name || "",
            email: initialData.email || "",
            headlines: initialData.headlines || "",
            location: initialData.location || "",
            skills: Array.isArray(initialData.skills) ? initialData.skills.join(", ") : initialData.skills || "",
        });
     }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    const skillsArray = data.skills.split(",").map(skill => skill.trim()).filter(skill => skill !== "");
    // Extract the file from FileList if it exists
    const resumeFile = data.resume?.[0];
    onSubmit({ ...data, skills: skillsArray, resume: resumeFile || initialData?.resume_url });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-card/40 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User size={16} className="text-primary"/> Full Name
          </Label>
          <Input id="name" {...register("name")} placeholder="Your Full Name" />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={16} className="text-primary"/> Email Address
          </Label>
          <Input id="email" {...register("email")} placeholder="your.email@example.com" />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin size={16} className="text-primary"/> Location
          </Label>
          <Input id="location" {...register("location")} placeholder="e.g. New York, USA" />
          {errors.location && <p className="text-destructive text-xs">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="headlines" className="flex items-center gap-2">
            <Briefcase size={16} className="text-primary"/> Professional Headline
          </Label>
          <Input id="headlines" {...register("headlines")} placeholder="e.g. Full Stack Developer | React Expert" />
          {errors.headlines && <p className="text-destructive text-xs">{errors.headlines.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills" className="flex items-center gap-2">
          <Award size={16} className="text-primary"/> Skills (comma separated)
        </Label>
        <Textarea 
          id="skills" 
          {...register("skills")} 
          placeholder="e.g. React, Node.js, Python, AWS, UX Design"
          className="min-h-[100px]"
        />
        {errors.skills && <p className="text-destructive text-xs">{errors.skills.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume" className="flex items-center gap-2">
          <FileText size={16} className="text-primary"/> Resume (PDF or Doc)
        </Label>
        <Input 
          id="resume" 
          type="file" 
          accept=".pdf,.doc,.docx"
          {...register("resume")}
          className="file:bg-primary file:text-primary-foreground file:border-none file:px-4 file:py-1 file:rounded-md file:mr-4 file:cursor-pointer hover:file:bg-primary/90"
        />
        {initialData?.resume_url && (
           <p className="text-xs text-muted-foreground mt-1">
             Existing resume: <a href={initialData.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Current Resume</a>
           </p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-4 font-bold h-12 text-lg">
        {loading ? "Saving Profile..." : "Update Professional Profile"}
      </Button>
    </form>
  );
};

export default CandidateProfileForm;
