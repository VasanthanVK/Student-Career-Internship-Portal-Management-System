import { MapPin, Briefcase, FileText, Mail, User } from 'lucide-react';
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail size={14} className="text-primary"/>
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} className="text-primary"/>
          <span>{candidate.location}</span>
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
