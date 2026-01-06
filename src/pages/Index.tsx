import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { SocialProofBar } from "@/components/sections/SocialProofBar";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <SocialProofBar />
      <IndustriesSection />
      <ProblemSection />
      <SolutionSection />
      <ServicesSection />
      <CaseStudiesSection />
      <ProcessSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
