export interface SampleResume {
  name: string;
  role: string;
  resumeText: string;
  jobDescription: string;
}

export const SAMPLES: SampleResume[] = [
  {
    name: "Alex Rivera (Software Engineer)",
    role: "Engineering - Frontend focus",
    resumeText: `ALEX RIVERA
Email: alex.rivera@example.com | Phone: 555-019-2831 | New York, NY
Portfolio: github.com/alexrivera-codes

PROFESSIONAL SUMMARY
Qualified software engineer with 3+ years of experience working in tech. Skilled in writing code and fixing application issues. Seeking a frontend engineer position.

CORE SKILLS
Java, HTML, CSS, JavaScript, Git, Team player, Communication, React (basic), SQL.

EXPERIENCE
Frontend Developer | WebSolutions Inc. | Jan 2024 - Present
* Responsible for writing clean code and implementing UI designs.
* Helped the team with migrating website pages to modern components.
* Fixed server errors and optimized database speeds in SQL.
* Talked to designers and product managers to discuss new platform features.

Junior Software Developer | CodeCore Labs | Aug 2022 - Dec 2023
* Worked on building responsive website parts for mobile clients.
* Wrote unit tests for components to verify correct outputs.
* Attended weekly sprint meetings to discuss task breakdowns.
* Managed code deployments using standard version control.

EDUCATION
B.S. in Computer Science | State University | Graduated May 2022
`,
    jobDescription: `Senior Frontend Architect
Role Overview:
We are looking for a Senior Frontend Architect to design scalable client architectures using React, TypeScript, and Docker/Kubernetes.

Key Requirements:
- 5+ years of software development experience.
- Deep expertise in React 18, TypeScript, Tailwind CSS, and Next.js.
- Strong understanding of containerization (Docker, Kubernetes) and CI/CD pipelines (GitHub Actions, Jenkins).
- Proven track record of demonstrating quantifiable impact, optimizing application performance, and spearheading architectural migrations.
- Excellent usage of dynamic action verbs and metric-driven highlights.
`
  },
  {
    name: "Taylor Vance (Product Manager)",
    role: "Management - Technical PM",
    resumeText: `TAYLOR VANCE
taylor.vance@example.com | Seattle, WA | linkedin.com/in/taylor-vance

TECHNICAL PRODUCT MANAGER
Cross-functional leader with a history of shipping software. Experienced in managing backlogs, working with developers, and talking with executives.

AREAS OF EXPERIENCE
Agile methodologies, Jira, Slack, User interviews, Roadmapping, Product Launch, Python.

EXPERIENCE
Product Manager | CloudSphere Technologies | June 2024 - Present
- Created the product backlog and wrote user stories for the core cloud module.
- Met with clients to gather feedback about user experience friction.
- Oversaw daily standups and sprint planning sessions with 8 engineers.
- Looked at product analytics reports to find drop-offs in the sign-up funnel.

Associate PM | RetailSync Software | Nov 2022 - May 2024
- Coordinated the release of the mobile invoice tool.
- Conducted user surveys to understand popular features.
- Suggested changes to the checkout screens which reduced complexity.
- Wrote release notes and product documentation for customer support teams.

EDUCATION
B.A. in Business Administration | Seattle College | 2022
`,
    jobDescription: `Lead Technical Product Manager (Growth)
Requirements:
- Proven experience utilizing analytical tools (Amplitude, Mixpanel, SQL, Google Analytics) to drive user retention.
- Hands-on history of establishing quantifiable KPIs (e.g., grew activation by 20%, improved customer lifetime value).
- Experience leading high-impact roadmaps and running product growth experiments (A/B testing).
- Excellent written documentation, technical background, and active collaboration methods.
`
  },
  {
    name: "Jordan Lee (Digital Marketer)",
    role: "Marketing - Campaign Specialist",
    resumeText: `JORDAN LEE
jordan.lee@domain.com | Austin, TX

DIGITAL MARKETING SPECIALIST
Passionate marketer looking to help a startup scale their campaigns. Focused on social media, writing blog post articles, and newsletter updates.

EXPERIENCE
Digital Marketer | Austin Media Labs | Jan 2023 - Present
* Responsible for writing weekly SEO-friendly blog posts.
* Managed Google Ads campaigns and tried to find lower cost per click keywords.
* Curated social media calendars for Twitter, LinkedIn, and Facebook pages.
* Created visual graphic templates in Canva for product announcements.

Marketing Assistant | Austin Local Events | Mar 2022 - Dec 2022
* Assisted with planning logistics for regional trade show booths.
* Handled email blast distribution to subscribers.
* Analyzed traffic patterns to see which blog posts got visitors.
`,
    jobDescription: "" // Generates general analysis against industry standards
  }
];
