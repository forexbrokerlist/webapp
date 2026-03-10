SECTION 1: AD MONETIZATION SYSTEM
The site currently shows “Your brand here” placeholder banners with two ad types detected in URLs: ?type=Banner and ?type=Tools. Neither is live or connected to a payment flow.

1.1 Ad Slot Infrastructure
[x] Define all ad slot positions: Homepage Hero Banner, Sidebar (per broker page), Footer Banner, Tools Section Banner, Category Page Banner
[x] Create Ad model in the database with fields: slot_id, advertiser_name, image_url, destination_url, type (Banner | Tools | Sponsor), status (pending | active | expired), start_date, end_date, impressions, clicks
[x] Build an Ad rendering component that fetches active ads per slot and renders them with proper tracking (impression pixel, click redirect)
[x] Replace all “Your brand here” placeholder banners with the dynamic Ad component
[x] Implement fallback: if no active ad exists for a slot, show a house ad (e.g., “Advertise here” CTA)

1.2 Self-Serve Advertiser Purchase Flow
[x] Build /advertise page with full pricing table: listing the available ad packages (Sponsor Slot, Banner Ad, Tools Section Ad) with clear pricing per tier
[x] Build a multi-step ad submission form: Step 1: Select ad type and duration. Step 2: Upload creative (logo, banner image). Step 3: Enter destination URL. Step 4: Review and pay
[x] Implement form validation for image dimensions and file size per ad slot spec
[x] Add Stripe (or Razorpay for INR billing) payment integration on the final step
[x] On successful payment, auto-create an Ad record with status: pending and trigger an admin notification email

1.3 Admin Ad Management Panel
[x] Build an admin dashboard route (protected by admin role) at /admin/ads
[x] List all ads with status filters: Pending, Active, Expired, Rejected
[x] Admin can approve or reject a pending ad (trigger email notification to advertiser on status change)
[x] Display impression and click analytics per ad
[x] Allow admin to manually extend or expire any ad

1.4 Ad Analytics for Advertisers
[x] Build an advertiser-facing analytics page: /advertiser/dashboard (behind auth)
[x] Show per-campaign stats: Total Impressions, Total Clicks, CTR, Days Remaining
[x] Allow advertisers to download a basic CSV report of their campaign performance





SECTION 2: AI TOOLS INTEGRATION (3 TOOLS)
User confirmed 3 AI tools are pending. Tool 1 is AI Deep Research. Tool 1:  Deep Research
Tool 2:
Tool 3:



2.1 AI Tools Infrastructure (Shared)
[ ] Set up a secure server-side API route for all AI tool calls (never expose API keys client-side)
[ ] Implement rate limiting per user IP and per authenticated user on AI endpoints
[ ] Add streaming response support (SSE or Vercel AI SDK) for the Deep Research tool so users see output being generated in real time rather than waiting for the full response
[ ] Create a ToolUsage database model to track: user_id, tool_name, timestamp, tokens_consumed for cost monitoring
[ ] Add a usage quota enforcement middleware that checks the user’s monthly usage against their plan before allowing the AI call
[ ] Build a /tools landing page that showcases all three tools with descriptions, screenshots, and a clear CTA to try each one





SECTION 3: BROKER DATA QUALITY
Several listings currently display generic placeholder descriptions (“Top rated forex broker based in global markets offering competitive spreads.“) and missing data fields. This directly damages user trust and SEO value.[ ] Audit all broker listings and tag those with placeholder descriptions (filter by description containing “Top rated forex broker based in”)
[ ] For each placeholder listing, either: Manually write a proper description, OR use an AI batch job that takes the broker name and website URL and generates a real description via the LLM (reviewed by admin before publishing)
[ ] Fix inconsistent score format: some show “3", others show “4.5/5”. Standardize to a numeric float out of 5.0 across all listings
[ ] Populate missing Est. (year established) fields by scraping each broker’s official website or using the Deep Research tool
[ ] Populate Regs count properly: many brokers show Regs: 0 despite being regulated. Link each broker to a Regulations table with actual regulator names (FCA, CySEC, ASIC, etc.)
[ ] Add broker-level fields that are currently absent from the cards: Headquarters country, Available trading platforms (MT4, MT5, proprietary), Asset types supported, Languages supported
[ ] Deduplicate “Top Forex Brokers List” entries (3 identical entries visible on homepage)



SECTION 4: PRODUCTION INFRASTRUCTURE

4.1 Domain and Deployment
[ ] Move off fb-listing-webapp.vercel.app to a proper custom domain (e.g., forexbrokerslisting.com or similar)
[ ] Configure DNS, SSL certificate, and Vercel custom domain settings
[ ] Set up separate staging.yourdomain.com environment for pre-production testing
[ ] Configure environment variables properly across dev, staging, and production environments

4.2 SEO
[ ] Add dynamic <title> and <meta description> tags for every broker detail page using broker-specific data
[ ] Generate and submit a sitemap.xml that includes all broker pages, category pages, and blog posts
[ ] Create a proper robots.txt file allowing crawl of public pages and disallowing admin routes
[ ] Add canonical URL tags to all paginated listing pages to prevent duplicate content penalties
[ ] Implement structured data (JSON-LD FinancialProduct or Organization schema) on each broker page for rich search results
[ ] Add Open Graph and Twitter Card meta tags to broker pages for proper social sharing previews

4.3 Analytics and Monitoring
[ ] Integrate Google Analytics 4 (or Plausible for privacy-first analytics) across all pages
[ ] Set up event tracking for: Ad clicks, Broker page views, AI tool usage, Newsletter signups, Submit form completions, Advertise page conversions
[ ] Integrate error monitoring (Sentry or Vercel’s built-in logging) for catching runtime errors in production
[ ] Set up uptime monitoring with alerting (BetterUptime or similar) on the production domain

4.4 Security
[ ] Add HTTP security headers: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
[ ] Implement server-side rate limiting on the broker Submit form to prevent spam submissions
[ ] Add CAPTCHA (hCaptcha or Cloudflare Turnstile) to the Submit form and the newsletter signup
[ ] Ensure all admin routes are protected behind authentication and role-based access control
[ ] Sanitize all user-submitted content (broker descriptions, ad creative metadata) before storing or rendering to prevent XSS

4.5 Performance
[ ] Audit and optimize Core Web Vitals: target LCP under 2.5 seconds, CLS under 0.1, FID under 100ms
[ ] Ensure all broker logo and sponsor images are served in WebP format with proper width and height attributes
[ ] Implement pagination or infinite scroll correctly so that list pages load fast even with 14 pages of data
[ ] Use Vercel’s Edge Caching or ISR (Incremental Static Regeneration) for broker listing pages to reduce server load





SECTION 5: USER EXPERIENCE AND CONTENT

5.1 Missing Pages and Content
[ ] Build a proper /about page with: company story, mission, team section, and contact information
[ ] Build a proper /blog section (the link exists in footer but needs content strategy and at least 5 seed articles for SEO)
[x] Create /terms (Terms of Service) and /privacy (Privacy Policy) pages. These are legally required, especially for handling advertiser data and newsletter emails
[x] Create a /disclaimer page clarifying that listings are for informational purposes and do not constitute financial advice (critical for forex content legally)

5.2 Newsletter System
[x] Connect the newsletter subscription form to an actual email marketing provider (Mailchimp, ConvertKit, or Resend)
[x] Create a welcome email sequence for new subscribers
[x] Set up a weekly or bi-weekly digest of new broker listings for subscribers
[ ] Add double opt-in confirmation to comply with GDPR and CAN-SPAM

5.3 User Authentication Improvements
[ ] “Sign In” button exists but needs to be tested end-to-end for all auth flows: sign up, login, forgot password, email verification
[ ] Add Google OAuth as a login option to reduce friction for new users
[ ] After sign in, redirect users to a dashboard showing their saved brokers, saved comparisons, and AI tool usage remaining

5.4 Broker Submission Flow
[ ] Test the /submit form end-to-end and confirm the submission reaches the admin review queue
[ ] Add a confirmation email to the submitter after their broker is submitted
[ ] Add a status tracking page: submitter can check if their listing is pending, approved, or rejected
[ ] Create a “Claim Your Listing” flow for brokers who are already listed but want to manage their profile



SECTION 6: MONETIZATION TIERS (PRICING STRUCTURE)
This is a strategic recommendation, not purely a developer task, but the developer needs to implement the plan you finalize.[ ] Define and implement subscription tiers for broker users:

Free Listing: Basic profile, no AI research reports
Featured Listing (paid): Appears at top of relevant category, “Featured” badge, 1 AI Deep Research report per month
Premium Sponsor (paid): Logo in sponsor section, banner ad inclusion, unlimited AI reports, analytics dashboard
[ ] Define pricing tiers for retail users (traders visiting the site):

Free: 3 AI tool uses per month, basic broker data
Pro (paid): Unlimited AI tool uses, broker comparison history, save reports
[ ] Implement plan enforcement logic in the backend before each gated action