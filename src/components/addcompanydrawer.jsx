import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import useFetch from "@/hooks/usefetch";
import { addNewCompany } from "@/api/apiCompanies";
import { useEffect } from "react";
import BarLoader from "./ui/BarLoader";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) => file?.[0] && file?.[0].type.startsWith("image/"),
      "Only images are allowed"
    ),
  company_email: z.string().email({ message: "Invalid email" }),
  hr_phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  company_address: z.string().min(1, { message: "Address is required" }),
  company_website: z.string().url({ message: "Invalid URL" }).or(z.literal("")),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [dataAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button type="button" size="lg" variant="secondary" className="h-12 border-dashed border-2 hover:bg-secondary/80">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-8">
        <DrawerHeader className="text-center max-w-lg mx-auto w-full">
          <DrawerTitle className="text-3xl font-bold">Add a New Company</DrawerTitle>
          <DrawerDescription className="text-muted-foreground mt-2">
            Enter your company details to start posting internships.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="max-h-[70vh] overflow-y-auto px-6">
          <form className="max-w-lg mx-auto w-full space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-semibold">Company Name</Label>
                <Input 
                  id="company-name"
                  placeholder="e.g. Acme Corp" 
                  className="h-12 bg-background/50"
                  {...register("name")} 
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-email" className="text-sm font-semibold">Company Email</Label>
                  <Input 
                    id="company-email"
                    type="email"
                    placeholder="hr@acme.com" 
                    className="h-12 bg-background/50"
                    {...register("company_email")} 
                  />
                  {errors.company_email && <p className="text-red-500 text-sm mt-1">{errors.company_email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr-phone" className="text-sm font-semibold">HR Phone</Label>
                  <Input 
                    id="hr-phone"
                    placeholder="+91 98765 43210" 
                    className="h-12 bg-background/50"
                    {...register("hr_phone")} 
                  />
                  {errors.hr_phone && <p className="text-red-500 text-sm mt-1">{errors.hr_phone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-address" className="text-sm font-semibold">Company Address</Label>
                <Textarea
                  id="company-address"
                  placeholder="123 tech street, city, state" 
                  className="bg-background/50 min-h-[80px]"
                  {...register("company_address")} 
                />
                {errors.company_address && <p className="text-red-500 text-sm mt-1">{errors.company_address.message}</p>}
              </div>

               <div className="space-y-2">
                  <Label htmlFor="company-website" className="text-sm font-semibold">Company Website</Label>
                  <Input 
                    id="company-website"
                    placeholder="https://acme.com" 
                    className="h-12 bg-background/50"
                    {...register("company_website")} 
                  />
                  {errors.company_website && <p className="text-red-500 text-sm mt-1">{errors.company_website.message}</p>}
                </div>

              <div className="space-y-2">
                <Label htmlFor="company-logo" className="text-sm font-semibold">Company Logo</Label>
                <Input
                  id="company-logo"
                  type="file"
                  accept="image/*"
                  className="h-12 bg-background/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                  {...register("logo")}
                />
                {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
              </div>
            </div>

            {errorAddCompany?.message && (
              <p className="text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center font-medium">
                {errorAddCompany?.message}
              </p>
            )}

            {loadingAddCompany && <BarLoader loading={true} />}

            <div className="flex gap-4 pt-4 pb-4">
              <DrawerClose asChild className="flex-1">
                <Button type="button" variant="outline" className="h-12">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="button"
                variant="default"
                className="flex-1 h-12 font-bold shadow-lg"
                onClick={handleSubmit(onSubmit)}
                disabled={loadingAddCompany}
              >
                {loadingAddCompany ? "Adding..." : "Add Company"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
