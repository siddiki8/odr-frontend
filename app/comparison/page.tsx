"use client";

import React from 'react';
import { ComparisonTable } from '@/components/landing/ComparisonTable';

export default function ComparisonPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
       {/* The title is included within the ComparisonTable component */}
       <ComparisonTable />
    </section>
  );
} 