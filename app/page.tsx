"use client"
import React from "react"


// Import the new header component
import { Header } from "@/components/Header"

// Import the new landing page components
import { HeroSection } from "@/components/landing/HeroSection"
import { ValuePropositionSection } from "@/components/landing/ValuePropositionSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { ArchitectureSection } from "@/components/landing/ArchitectureSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { TechStackSection } from "@/components/landing/TechStackSection"
import { CTASection } from "@/components/landing/CTASection"
// import { LandingFooter } from "@/components/landing/LandingFooter" // Removed import

export default function LandingPage() {
  return (
    // The main tag rendered by app/layout.tsx has flex-grow, no need here
    <>
      {/* Header is now rendered in layout.tsx */}
      <HeroSection />
      <ValuePropositionSection />
      <FeaturesSection />
      <ArchitectureSection />
      <HowItWorksSection />
      <TechStackSection />
      <CTASection />
      {/* Footer is now rendered in layout.tsx */}
    </>
  )
}

// Note: DynamicResearchLayout and its related imports were removed.

