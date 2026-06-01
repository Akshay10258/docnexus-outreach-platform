# DocNexus Outreach Platform MVP

[Live Web App (Vercel)](https://akshay10258-docnexus-outreach-platf.vercel.app) | [Video Walkthrough Demo](https://drive.google.com/drive/folders/1xEmbvr0J5bRrSpKgaNCh4ioL8yIMueRO?usp=sharing)

> [!WARNING]
> **Important Note on Live Deployment Data Persistence**
> The live Vercel deployment is for visual preview purposes only. Because this MVP utilizes a lightweight **SQLite** database for maximum portability and ease of setup, Vercel's ephemeral Serverless Functions will occasionally wipe newly created data (such as new campaigns) as instances spin up and down. **To test full end-to-end data persistence and mutations, please run the application locally.**

A lightweight, full-stack physician outreach and campaign management platform built for the DocNexus Engineering Internship take-home assignment.

## 🚀 Features

- **Physician Discovery**: Search, filter, and select healthcare professionals based on specialty, location, and affiliation.
- **Dynamic Campaign Builder**: Create multi-step outreach sequences with smart template variables (`{{doctor_name}}`, `{{specialty}}`, etc.).
- **Real-Time Variable Validation**: Regex-based validation engine in the Sequence Builder that instantly catches typos to prevent broken outreach templates.
- **AI-Powered Personalization**: Integrated with GitHub Models (`gpt-4o-mini`) to automatically generate hyper-personalized email drafts based on physician profiles and current user drafts.
- **Engagement History Timeline**: Deep-data aggregate that maps historical campaign data to individual physicians via an expandable inline timeline.
- **Time-Aware Analytics**: Campaign dashboards dynamically read `createdAt` timestamps to suppress fake analytics for newly launched demo campaigns while demonstrating populated charts for older seeded campaigns.
- **Dynamic Database Filters**: Replaced hardcoded arrays with Prisma `distinct` queries to ensure the Discovery filters scale dynamically with database growth.
- **Draft-to-Edit Workflow**: Robust state management allowing users to save drafts and resume building sequences later, safely merging newly enrolled physicians without cache issues.

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 15 (App Router), React 19, Vanilla CSS (CSS Modules/Inline Styles for scoped, lightweight styling).
- **Backend**: Next.js API Routes (`app/api/*`) for serverless REST endpoints.
- **Database**: SQLite (via Prisma ORM) for lightweight, portable persistence.
- **AI Integration**: Native `fetch` API implementation against GitHub Models endpoint (no heavy SDKs required).

### API Endpoints
- `GET /api/physicians` - Fetches all physicians (supports future filtering)
- `POST /api/campaigns` - Creates a new draft campaign and sequence steps
- `GET /api/campaigns/:id` - Fetches a specific campaign with its sequences and enrolled physician profiles
- `PUT /api/campaigns/:id` - Updates an existing draft campaign (re-syncs sequence states)
- `PATCH /api/campaigns/:id/launch` - Transitions a campaign status from draft to active
- `POST /api/generate-mail` - Generates a highly personalized email sequence step via GitHub Models (LLM)

**Architecture Decisions:**
- *Shared Component Architecture*: The Campaign Builder components (`SequenceBuilder`, `PreviewPanel`, `CampaignForm`) were abstracted into a shared `components/` directory to facilitate code reuse across both the `/new` campaign creation flow and the `/[id]/edit` draft editing flow.
- *Template Variable Engine*: Built a real-time string replacement engine in the `PreviewPanel` to instantly visualize sequence steps dynamically based on the currently selected enrolled physician.
- *Prisma Transactions*: Utilized Prisma's nested `create` and `deleteMany` operations to cleanly handle complex sequence updates during campaign edits without race conditions.

## ⚙️ Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-link>
   cd docnexus-outreach-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment variables file:
   ```bash
   cp .env.example .env
   ```
   *Note: You will need a GitHub Personal Access Token to use the AI Generation feature.*

4. **Database Setup**
   Initialize the SQLite database and run the seed script to populate the 20 mock physicians:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔮 What's Next? (Future Work)

Given more time, I would prioritize the following enhancements:
1. **User Authentication & Global Settings**: Implement NextAuth to allow MSLs to log in and define their sender profiles (`Name`, `Title`, `Company`) globally, rather than per-campaign.
2. **Email Delivery Simulation**: Connect a mock SMTP service (like Ethereal Email or Resend test keys) to simulate the actual dispatch of sequence steps based on the `delayDays`.
3. **Advanced Filtering**: Add multi-select comboboxes for filtering physicians by multiple specialties or states simultaneously.
4. **Unit & E2E Testing**: Add Jest and Playwright coverage for the core Campaign Builder logic to ensure the sequence state arrays are never mutated improperly.
