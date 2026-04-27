import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Mail, MapPin, Award, FileText, User, Phone, Linkedin, Github, LinkedinIcon } from 'lucide-react';
import { Gif02FreeIcons, Git, GitBranch, Linkedin02Icon} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import ResumeAnalysisDialog from './Resumebox';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  headlines: z.string().min(5, "Headline must be at least 5 characters"),
  location: z.string().min(2, "Location is required"),
  skills: z.string().min(1, "Please enter at least one skill"),
  resume: z.any().optional(),
  phone: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
});

const CandidateProfileForm = ({ initialData, onSubmit, loading }) => {
  const[open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      headlines: initialData?.headlines || "",
      location: initialData?.location || "",
      skills: Array.isArray(initialData?.skills) ? initialData.skills.join(", ") : initialData?.skills || "",
      phone: initialData?.phone || "",
      linkedin: initialData?.linkedin || "",
      github: initialData?.github || "",
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
            phone: initialData.phone || "",
            linkedin: initialData.linkedin || "",
            github: initialData.github || "",
        });
     }
  }, [initialData, reset]);

  const handleResumeParsed = (parsedData) => {
    if (parsedData.name) setValue("name", parsedData.name);
    if (parsedData.email) setValue("email", parsedData.email);
    if (parsedData.phone) setValue("phone", parsedData.phone);
    if (parsedData.linkedin) setValue("linkedin", parsedData.linkedin);
    if (parsedData.github) setValue("github", parsedData.github);
    if (parsedData.skills && parsedData.skills.length > 0) {
      setValue("skills", parsedData.skills.join(", "));
    }
  };

  const handleFormSubmit = (data) => {
    const skillsArray = data.skills.split(",").map(skill => skill.trim()).filter(skill => skill !== "");
    // Extract the file from FileList if it exists
    const resumeFile = data.resume?.[0];
    onSubmit({ ...data, skills: skillsArray, resume: resumeFile || initialData?.resume_url });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-card/40 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
       <p className="text-sm text-muted-foreground">Upload your resume to automatically populate your profile fields</p>
      <ResumeAnalysisDialog onResumeParsed={handleResumeParsed} />
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
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone size={16} className="text-primary"/> Phone Number
          </Label>
          <Input id="phone" {...register("phone")} placeholder="e.g. +1 234 567 8900" />
          {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
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

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <HugeiconsIcon icon={Linkedin02Icon} size={16} className="text-primary"/> LinkedIn Profile
          </Label>
          <Input id="linkedin" {...register("linkedin")} placeholder="https://linkedin.com/in/yourprofile" />
          {errors.linkedin && <p className="text-destructive text-xs">{errors.linkedin.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <HugeiconsIcon icon={Git} size={16} className="text-primary"/> GitHub Profile
          </Label>
          <Input id="github" {...register("github")} placeholder="https://github.com/yourusername" />
          {errors.github && <p className="text-destructive text-xs">{errors.github.message}</p>}
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