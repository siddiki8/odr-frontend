"use client";

import React from 'react';
import { ComparisonTable } from '@/components/landing/ComparisonTable';

export default function ComparisonPage() {
  return (
    <main className="bg-[var(--nd-bg)] text-[var(--nd-text-primary)] pt-14 min-h-screen">
      <div className="container mx-auto px-6 pb-16 max-w-[1200px]">
        <header className="pt-12 mb-10 border-b border-[var(--nd-border)] pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--nd-text-secondary)] mb-3">
            ODR-API — COMPARISON
          </p>
          <h1 className="font-grotesk text-3xl font-medium text-[var(--nd-text-display)] tracking-[-0.01em]">
            Why Choose a Custom Solution?
          </h1>
        </header>
        <ComparisonTable />
      </div>
    </main>
  )
} 