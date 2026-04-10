import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Users, Briefcase, FileText, UserCheck, Mail, MapPin, Building2, CheckCircle, XCircle, Globe, Phone, Flag, MailOpen } from "lucide-react";
import BarLoader from "@/components/ui/BarLoader";
import useFetch from "@/hooks/usefetch";
import { getAllCandidates } from "@/api/apiCandidate";
import { getJobs } from "@/api/apijobs";
import { getAllApplications } from "@/api/apiApplications";
import { getCompanies, updateCompanyStatus } from "@/api/apiCompanies";
import { getAllReports, markReportRead } from "@/api/apiReports";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingCandidates,
    data: candidates,
    fn: fnCandidates,
  } = useFetch(getAllCandidates);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {});

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getAllApplications);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: updatingStatus,
    error: errorUpdatingStatus,
    fn: fnUpdateStatus,
  } = useFetch(updateCompanyStatus);

  const {
    loading: loadingReports,
    data: reports,
    fn: fnReports,
  } = useFetch(getAllReports);

  const { fn: fnMarkRead } = useFetch(markReportRead);

  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.role === "admin") {
      fnCandidates();
      fnJobs();
      fnApplications();
      fnCompanies();
      fnReports();
    }
  }, [isLoaded, user]);


  const handleStatusUpdate = async (companyId, status) => {


  if (!companyId) {
    console.error("Company ID missing");
    return;
  }

  try {
    await fnUpdateStatus({
      company_id: companyId,
      status,
      approved_by: user.id,
    });

    // Send approval/rejection email to the company
    const company = companies?.find((c) => c.id === companyId);
    if (company?.company_email) {
      try {
        const res = await fetch("http://localhost:3000/api/company/status-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            companyName: company.name,
            companyEmail: company.company_email,
            companyLogo: company.logo_url || "",
            adminName: user?.fullName || "Admin",
          }),
        });
        const data = await res.json();
        if (data.success) {
        } else {
          console.warn("⚠️ Email API responded with failure:", data.message);
        }
      } catch (emailErr) {
        console.error("❌ Failed to send company email:", emailErr);
      }
    } else {
      console.warn("⚠️ No company email found, skipping notification.");
    }

    fnCompanies(); // refresh
  } catch (err) {
    console.error("Failed to update status:", err);
  }
};

  if (!isLoaded || loadingCandidates || loadingJobs || loadingApplications || loadingCompanies) {
    return <BarLoader loading={true} />;
  }

  // Double check admin role
  if (user?.unsafeMetadata?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center mt-32">
        <h2 className="text-4xl font-bold text-red-500">Access Denied</h2>
        <p className="mt-4 text-xl text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const stats = [
    { title: "Total Candidates", value: candidates?.length || 0, icon: <Users className="h-4 w-4 text-blue-500" /> },
    { title: "Active Jobs", value: jobs?.length || 0, icon: <Briefcase className="h-4 w-4 text-green-500" /> },
    { title: "Total Applications", value: applications?.length || 0, icon: <FileText className="h-4 w-4 text-purple-500" /> },
    { title: "Registered Companies", value: companies?.length || 0, icon: <Building2 className="h-4 w-4 text-pink-500" /> },
  ];

  return (
    <div className="flex flex-col gap-8 px-5 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl tracking-tighter">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl">
          Real-time overview of the platform activity and verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Live data from system</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Company Verification Section */}
        <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="text-primary" /> Company Verification
            </CardTitle>
            <CardDescription>Review and approve company registrations.</CardDescription>
            {errorUpdatingStatus?.message && (
              <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{errorUpdatingStatus?.message}</p>
            )}
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                   <TableHead>Company</TableHead>
                   <TableHead>Contact Info</TableHead>
                   <TableHead>Address & Website</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies?.length > 0 ? (
                  companies.map((company, index) => (
                    <TableRow key={company.id || company.name || index}>
                       <TableCell className="font-medium">
                         <div className="flex items-center gap-3">
                           <img src={company.logo_url} alt={company.name} className="h-8 w-8 rounded object-contain bg-white p-1" />
                           <span>{company.name}</span>
                         </div>
                       </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1"><Mail size={12}/> {company.company_email}</div>
                          <div className="flex items-center gap-1"><Phone size={12}/> {company.hr_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1 text-xs max-w-[200px]">
                          <div className="flex items-start gap-1"><MapPin size={12} className="mt-0.5 shrink-0"/> <span className="line-clamp-1">{company.company_address}</span></div>
                          <div className="flex items-center gap-1 text-blue-500">
                             <Globe size={12}/> 
                             <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="hover:underline line-clamp-1">
                                {company.company_website?.replace('https://', '').replace('http://', '')}
                             </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant={company.status === 'approved' ? 'default' : company.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {company.status || 'pending'}
                         </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                           {company.status !== 'approved' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 border-green-500/50 text-green-500 hover:bg-green-500/10"
                                onClick={() => handleStatusUpdate(company.id, 'approved')}
                                disabled={updatingStatus}
                              >
                                <CheckCircle size={14} className="mr-1"/> Approve
                              </Button>
                           )}
                           {company.status !== 'rejected' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 border-red-500/50 text-red-500 hover:bg-red-500/10"
                                onClick={() => handleStatusUpdate(company.id, 'rejected')}
                                disabled={updatingStatus}
                              >
                                <XCircle size={14} className="mr-1"/> Reject
                              </Button>
                           )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No companies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Candidate Directory Section */}
        <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="text-primary" /> Candidate Directory
            </CardTitle>
            <CardDescription>View all candidates who have created an account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Joined At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates?.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <TableRow key={candidate.candidate_id || candidate.id || index}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-muted-foreground" />
                          {candidate.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-muted-foreground" />
                          {candidate.location || "Not Set"}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      No candidates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Reports Inbox Section */}
        <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="text-red-400" />
              Reports Inbox
              {reports?.filter(r => !r.is_read).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {reports.filter(r => !r.is_read).length} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Reports submitted by candidates and recruiters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.length > 0 ? (
                  reports.map((report, index) => (
                    <TableRow
                      key={report.id || index}
                      className={!report.is_read ? "bg-red-500/5" : ""}
                    >
                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span className="font-medium">{report.reporter_name}</span>
                          <span className="text-muted-foreground">{report.reporter_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.reporter_role === "recruiter" ? "default" : "secondary"} className="capitalize">
                          {report.reporter_role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[150px] truncate">{report.subject}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[250px]">
                        <p className="line-clamp-2">{report.message}</p>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(report.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {report.is_read ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/40">
                            <MailOpen size={12} className="mr-1" /> Read
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-primary/40"
                            onClick={async () => {
                              await fnMarkRead({ report_id: report.id });
                              fnReports();
                            }}
                          >
                            Mark Read
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No reports yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;