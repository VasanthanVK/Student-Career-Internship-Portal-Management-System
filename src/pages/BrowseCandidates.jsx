import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/usefetch';
import { getAllCandidates } from '@/api/apiCandidate';
import BarLoader from '@/components/ui/BarLoader';
import CandidateCard from '@/components/CandidateCard';
import { Input } from '@/components/ui/input';
import { Search, Users, Filter, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from 'country-state-city';

const BrowseCandidates = () => {
    const { isLoaded, user } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [filteredCandidates, setFilteredCandidates] = useState([]);

    const {
        loading: loadingCandidates,
        data: candidates,
        fn: fnCandidates,
    } = useFetch(getAllCandidates);

    useEffect(() => {
        if (isLoaded) {
            fnCandidates();
        }
    }, [isLoaded]);

    useEffect(() => {
        if (candidates) {
            const filtered = candidates.filter(candidate => {
                const nameMatch = (candidate.name || "").toLowerCase().includes(searchQuery.toLowerCase());
                const skillsMatch = candidate.skills?.some(skill => 
                    (skill || "").toLowerCase().includes(searchQuery.toLowerCase())
                );
                const headlineMatch = (candidate.headlines || "").toLowerCase().includes(searchQuery.toLowerCase());
                const locationMatch = locationFilter === "all" || candidate.location === locationFilter;
                
                return (nameMatch || skillsMatch || headlineMatch) && locationMatch;
            });
            setFilteredCandidates(filtered);
        }
    }, [candidates, searchQuery, locationFilter]);

    if (!isLoaded || loadingCandidates) {
        return <BarLoader loading={true} />;
    }

    return (
        <div className="container mx-auto py-10 px-4 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2">
                    <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl tracking-tighter flex items-center gap-4">
                        <Users className="text-destructive" size={48}/> Candidates
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Discover top-tier candidates for your internships. Search by name, professional headline, or specific skills.
                    </p>
                </div>
                
                <div className="relative w-full md:w-96 group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input 
                        placeholder="Search by name, skill, or headline..." 
                        className="pl-10 h-14 bg-card/60 border-border/50 backdrop-blur-md rounded-xl text-lg pr-12 focus:border-destructive/40 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                          <X 
                            size={18} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive cursor-pointer"
                            onClick={() => setSearchQuery("")}
                          />
                      )}
                   </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-border/30 gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                   <Filter size={16}/> {filteredCandidates.length} Profiles Found
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="w-full sm:w-64 bg-card/40 border-border/50">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-destructive"/>
                                <SelectValue placeholder="Filter by Location" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {/* Get unique locations from candidates */}
                            {Array.from(new Set(candidates?.map(c => c.location).filter(Boolean))).map(loc => (
                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    {(locationFilter !== "all" || searchQuery) && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => {
                                setSearchQuery("");
                                setLocationFilter("all");
                            }}
                        >
                            Clear All
                        </Button>
                    )}
                </div>
            </div>

            {filteredCandidates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCandidates.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-card/20 rounded-3xl border border-dashed border-border/50">
                    <Users size={64} className="text-muted-foreground/30"/>
                    <div className="text-center">
                        <h3 className="text-xl font-bold">No candidates found</h3>
                        <p className="text-muted-foreground">Try adjusting your search criteria to find matching talent.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseCandidates;
