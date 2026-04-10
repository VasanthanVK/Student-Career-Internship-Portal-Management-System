import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import React from "react";
import { Link } from "react-router-dom";
import Company from "../Data/Company.json";
import Faqs from "../Data/Faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find your dream internship{""}
          <span className="flex items-center gap-2 sm:gap-6">
            and get {""}
            <img src="/logo.png" className="h-14 sm:h-24 lg:34" />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Explore thousands of internship listing or find the perfect candidate
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        <Link to="/job">
          <Button variant="blue" size="xl">
            Find Internship
          </Button>
        </Link>
        <Link to="/postjob">
          <Button size="xl" variant="destructive">
            Post an Internship
          </Button>
        </Link>
      </div>
      <Carousel plugins={[Autoplay({ delay: 1000 })]} className="w-full py-10">
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {Company.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <img src="/banner.jpeg" className="w-full" />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Internship Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for internship, track application, and more
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post internships, manage application and find the best candidate
          </CardContent>
        </Card>
      </section>
      <Accordion type="single" collapsible>
        {Faqs.map((Faq,index)=>{
       return( <AccordionItem  key={index} value={`item-${index+1}`}>
          <AccordionTrigger>{Faq.question}</AccordionTrigger>
          <AccordionContent>{Faq.answer}</AccordionContent>
        </AccordionItem>
       );
         })}
      </Accordion>
    </main>
  );
};

export default LandingPage;
