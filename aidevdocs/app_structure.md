# Application Structure

This document outlines the structure and key components of the Deep Research Simulator application.

## Core Technologies

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **UI:** React, Shadcn UI, Tailwind CSS, Framer Motion
-   **Backend/Database:** Firebase (Firestore for storing reports)
-   **State Management:** React Context API (`ResearchProvider`)

## Directory Structure Overview

```
.
├── app/                      # Next.js App Router: Routes and core UI
│   ├── globals.css           # Global styles (likely imported by layout)
│   ├── layout.tsx            # Root layout component (shared navigation, footer)
│   ├── page.tsx              # Home page component (research initiation)
│   └── reports/              # Route group for report-related pages
│       ├── [slug]/           # Dynamic route for individual reports
│       │   ├── loading.tsx   # Loading UI for individual report page
│       │   └── page.tsx      # Component for displaying a single saved report
│       ├── loading.tsx       # Loading UI for the reports list page
│       └── page.tsx          # Component for listing all saved reports
├── components/               # Reusable React components
│   ├── research-form.tsx     # Form for initiating research queries
│   ├── research-plan.tsx     # Component to display the generated research plan
│   ├── research-provider.tsx # Context provider for managing research state
│   ├── research-report.tsx   # Component to display the final research report content
│   ├── research-viewer.tsx   # Component to display real-time research progress/messages
│   ├── query-display.tsx     # Component to show the current research query
│   ├── theme-provider.tsx    # Handles light/dark theme switching
│   └── ui/                   # Shadcn UI components (ignored as per instruction)
├── hooks/                    # Custom React hooks
│   ├── use-mobile.tsx        # Hook to detect mobile devices (likely for responsive design)
│   ├── use-research.ts       # Hook to access research state from ResearchProvider
│   └── use-toast.ts          # Hook for displaying toast notifications (likely Shadcn UI toast)
├── lib/                      # Utility functions and services
│   ├── firebase.ts           # Firebase initialization and configuration (client-side only)
│   ├── research-service.ts   # Functions for interacting with Firestore (saving/fetching reports)
│   └── utils.ts              # General utility functions (e.g., cn for classnames, slug generation, date formatting)
├── public/                   # Static assets (images, fonts)
│   ├── fonts/
│   └── images/
│   ├── logo.png
│   └── ... (other placeholder images)
├── styles/                   # Additional global styles
│   └── globals.css           # (Note: another globals.css, might be legacy or specific overrides)
├── types/                    # TypeScript type definitions
│   └── research.ts           # Defines types related to research reports (SavedReport, etc.)
├── .gitignore                # Specifies intentionally untracked files
├── components.json           # Configuration for Shadcn UI CLI
├── next.config.mjs           # Next.js configuration file
├── package.json              # Project dependencies and scripts
├── pnpm-lock.yaml            # PNPM lock file
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # (Potentially, if exists) Project README
```

## Key Functionality & Data Flow

1.  **Research Initiation (`app/page.tsx`):**
    *   The user enters a research query into the `ResearchForm`.
    *   The `ResearchProvider` manages the state of the research process (plan, messages, report, status).
    *   `useResearch` hook provides access to this state.
    *   As the research progresses (simulated or via an API call not visible here, likely triggered within `ResearchProvider` or associated components), the `ResearchPlan` and `ResearchViewer` (displaying `messages`) are updated.
    *   Once complete, the `ResearchReport` component displays the final synthesized report.
    *   Framer Motion is used extensively for animations during state transitions (showing/hiding form, plan, report).

2.  **Saving Reports (`lib/research-service.ts`):**
    *   When a report is generated (presumably after the process in `app/page.tsx`), the user likely has an option to save it.
    *   The `saveResearchReport` function in `research-service.ts` is called.
    *   It generates a unique `slug` using `lib/utils.ts`.
    *   It saves the report data (query, report content, plan, messages, stats, timestamps) to the Firestore `research_reports` collection, using the client-side Firebase SDK initialized in `lib/firebase.ts`.

3.  **Viewing Reports (`app/reports/*`):**
    *   **List (`app/reports/page.tsx`):**
        *   Fetches all saved reports from Firestore using `getAllResearchReports` from `research-service.ts`.
        *   Displays reports in a grid of cards, showing title (extracted from markdown), query, date, and basic stats.
        *   Provides links to individual report pages using the report's `slug`.
    *   **Individual Report (`app/reports/[slug]/page.tsx`):**
        *   Extracts the `slug` from the URL parameters.
        *   Fetches the specific report data from Firestore using `getResearchReportBySlug`.
        *   Displays the report details using tabs:
            *   **Report Tab:** Renders the markdown content of the report with custom styling for headers, lists, code blocks, etc. Includes copy and download functionality.
            *   **Plan Tab:** Displays the research plan associated with the report (goal, search queries, sections).
            *   **Timeline Tab:** Shows the sequence of messages/steps recorded during the research process.

## Summary

The application provides a user interface for initiating a "deep research" process on a given query. It visualizes the research plan and progress, displays the final report, and allows users to save these reports to a Firebase backend. Saved reports can be browsed and viewed in detail, including the original plan and timeline. The frontend is built with Next.js, React, and TypeScript, utilizing Shadcn UI and Tailwind for styling, and Framer Motion for animations. Firestore serves as the database for persistent report storage. 