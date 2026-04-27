import { MapPin, Briefcase, FileText, Mail, User, Phone, Linkedin, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const CandidateCard = ({ candidate }) => {
  return (
    <Card className="flex flex-col h-full bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
          {candidate.name?.charAt(0) || <User size={24}/>}
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold">{candidate.name}</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            <Briefcase size={12}/> {candidate.headlines || "No Headline Set"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-2">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-foreground bg-secondary/40 p-2.5 rounded-lg border border-border/50">
            <Mail size={16} className="text-primary"/>
            <span className="truncate font-medium">{candidate.email}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/20 p-2 rounded-md border border-border/30">
              <MapPin size={14} className="text-destructive"/>
              <span className="truncate">{candidate.location || "N/A"}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/20 p-2 rounded-md border border-border/30">
                <Phone size={14} className="text-emerald-500"/>
                <span className="truncate">{candidate.phone}</span>
              </div>
            )}
          </div>

          {(candidate.linkedin || candidate.github) && (
             <div className="flex gap-2">
                {candidate.linkedin && (
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold tracking-wide uppercase bg-[#0A66C2]/10 text-[hsl(var(--foreground))] p-2 rounded-md hover:bg-[#0A66C2]/20 transition-colors border border-[#0A66C2]/20">
                    <Linkedin size={14} className="text-[#0A66C2]" /> LinkedIn
                  </a>
                )}
                {candidate.github && (
                  <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold tracking-wide uppercase bg-secondary/50 text-[hsl(var(--foreground))] p-2 rounded-md hover:bg-secondary transition-colors border border-border/50">
                    <Github size={14} /> GitHub
                  </a>
                )}
             </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Top Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills?.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight bg-primary/5 border-primary/10">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/30">
        <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" className="w-full h-10 gap-2 font-bold border-primary/20 hover:bg-primary/5 group" disabled={!candidate.resume_url}>
            <FileText size={16} className="text-primary group-hover:scale-110 transition-transform"/> 
            {candidate.resume_url ? "View Resume" : "No Resume Uploaded"}
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
