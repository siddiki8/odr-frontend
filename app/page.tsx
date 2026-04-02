import React from "react"
import { HeroSection } from "@/components/landing/HeroSection"
import { ValuePropositionSection } from "@/components/landing/ValuePropositionSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { ArchitectureSection } from "@/components/landing/ArchitectureSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { TechStackSection } from "@/components/landing/TechStackSection"
import { CTASection } from "@/components/landing/CTASection"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ValuePropositionSection />
      <FeaturesSection />
      <ArchitectureSection />
      <HowItWorksSection />
      <TechStackSection />
      <CTASection />
    </>
  )
}
