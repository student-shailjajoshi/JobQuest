
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Story from "@/components/landing/Story";
import Problem from "@/components/landing/Problem";
import Journey from "@/components/landing/Journey";
import UseCases from "@/components/landing/UseCases";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <Journey />
      <UseCases />
      <Story />
    </>
  );
}