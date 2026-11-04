export const config = {
    developer: {
        name: "Priyanka",
        fullName: "Priyanka Bana",
        initials: "PB",
        title: "Software Engineer | Data & AI",
        description:
            "Software engineer who builds data pipelines and LLM systems that hold up in production. Final-year Computer Engineering student at Vishwakarma University, Pune."
    },
    hero: {
        greeting: "Hi, I'm",
        bio: "I build reliable data pipelines, LLM quality systems and full-stack apps, with a soft spot for clean data and measurable results.",
        // Exact background colour of character.mp4 (printed by scripts/extract_frames.py).
        // The canvas and hero section use it so the character blends in seamlessly.
        backgroundColor: "#2c051c",
        frameCount: 64,
        framesPath: "/frames",
        resume: "/Priyanka_Bana_Resume.pdf"
    },
    social: {
        github: "priyankabana",
        email: "priyankabana0408@gmail.com",
        location: "Pune, India"
    },
    about: {
        title: "About Me",
        description:
            "I'm a final-year B.Tech Computer Engineering student at Vishwakarma University, Pune (CGPA 7.77). For the past year I've worked as a Software Engineer Intern on financial data and AI: building pipelines over SEC filings and earnings calls, shipping report products end to end, and designing quality gates that catch what LLMs get wrong. I care about owning problems to the root cause and proving results with numbers."
    },
    education: {
        degree: "B.Tech, Computer Engineering",
        institute: "Vishwakarma University, Pune",
        period: "2023 - 2027",
        score: "CGPA 7.77 / 10"
    },
    experiences: [
        {
            position: "Software Engineer Intern, Data & AI",
            company: "BuySellTips Financial Research",
            period: "Jul 2025 - Present",
            location: "Pune, India",
            description:
                "Build and own production data and LLM pipelines over SEC filings and earnings calls for an equity-research platform.",
            responsibilities: [
                "Built an LLM quality gate that audited 15 reports (547 sections) and caught 28 false claims, running 6,998 checks for $0.047 total",
                "Launched the Australian market: 62 reports in one batch, 0 failures, 100% QC pass, 60% lower LLM cost",
                "Shipped a 10-Q peer-benchmark report product in ~2 weeks: 64 reports, 64/65 passing QC, $4.93 total LLM spend",
                "Raised earnings-calendar match rate from 23% to 96% across 1,207 companies; cut daily missing-filing rejects from 56 to 0"
            ],
            technologies: ["Python", "PostgreSQL", "Neo4j", "Qdrant", "AWS", "LLM APIs"]
        },
        {
            position: "Software Engineer Intern",
            company: "Better Technology Labs",
            period: "Jun 2025 - Jul 2025",
            location: "Pune, India",
            description:
                "Developed a Django employee management system with authentication, role-based access and reporting, and sped up Python batch jobs with multiprocessing.",
            responsibilities: [
                "Built auth, role-based access control and reporting for a Django employee management system",
                "Used multiprocessing to speed up MySQL-backed Python batch jobs"
            ],
            technologies: ["Python", "Django", "MySQL"]
        },
        {
            position: "B.Tech, Computer Engineering",
            company: "Vishwakarma University, Pune",
            period: "2023 - 2027",
            location: "Pune, India",
            description:
                "CGPA 7.77 / 10. Coursework in data structures and algorithms, operating systems, DBMS, computer networks and machine learning.",
            responsibilities: [],
            technologies: []
        }
    ],
    projects: [
        {
            id: 1,
            title: "LLM Quality Gate",
            category: "Work · BuySellTips",
            technologies: "Python, PostgreSQL, LLM APIs, Rule Engine",
            image: "/images/quality-gate.svg",
            description:
                "A quality gate for AI-written equity research reports: deterministic rules plus a batched LLM classifier route every section to block, review or publish. An audit of 15 reports (547 company sections) caught 28 false claims, and 6,998 checks ran for $0.047 total with 0 failed calls. Threshold tuning halved the human review queue (753 to 357).",
            link: ""
        },
        {
            id: 2,
            title: "Earnings-Call Reports",
            category: "Work · BuySellTips",
            technologies: "Python, Neo4j, Qdrant, AWS S3, LLM APIs",
            image: "/images/earnings-pipeline.svg",
            description:
                "Launched an AI earnings-call report pipeline for the Australian market: 62 reports in one batch with 0 failures and a 100% QC pass rate. Vector retrieval cut LLM cost per batch by 60%, and process-level sharding cut runtime from ~90 to ~25 minutes.",
            link: ""
        },
        {
            id: 3,
            title: "10-Q Peer Benchmarks",
            category: "Work · BuySellTips",
            technologies: "Python, SQL, PostgreSQL, LLM APIs",
            image: "/images/peer-reports.svg",
            description:
                "Took a competitive-intelligence report product from spec to production in about two weeks: 64 reports generated with 64/65 passing QC for $4.93 in total model spend, using SQL peer selection, cached per-filing extraction and pre-screening that rejected 44 of 508 companies before any model call.",
            link: ""
        },
        {
            id: 4,
            title: "Global Earnings Calendar",
            category: "Work · BuySellTips",
            technologies: "Python, PostgreSQL, REST APIs, AWS, cron",
            image: "/images/earnings-calendar.svg",
            description:
                "Raised the earnings-calendar match rate from 23% to 96% across 1,207 companies and cut unmatched companies from 738 to 34 with a three-source fallback. Traced recurring overnight data corruption to an undocumented cloud scraper and removed ~27K stale records per run.",
            link: ""
        },
        {
            id: 5,
            title: "Serverless Bond Pipeline",
            category: "Work · BuySellTips",
            technologies: "Python, AWS Lambda, Docker, Selenium, PostgreSQL, boto3",
            image: "/images/bond-pipeline.svg",
            description:
                "An orchestrator pulls pending bond CUSIPs from PostgreSQL, splits them into batches of 10 and fans them out as asynchronous AWS Lambda invocations running containerised headless Chrome to collect daily FINRA price and yield data. Idempotent upserts and automatic session refresh with bounded retries make every run safe to repeat.",
            link: ""
        },
        {
            id: 6,
            title: "IPO Automation on EC2",
            category: "Work · BuySellTips",
            technologies: "Python, AWS EC2, Bash, cron, PostgreSQL, OpenAI Agents SDK",
            image: "/images/ipo-ec2.svg",
            description:
                "Daily NASDAQ IPO ingestion: cron starts an EC2 instance, runs the loader with idempotent merges and LLM enrichment for new listings only, then stops the instance and emails a run report (~4 min per run; 0 failures in 7 of 8 logged runs). A flock-based lease protocol lets 3 scheduled jobs share one instance safely.",
            link: ""
        },
        {
            id: 7,
            title: "Touchstone",
            category: "Data Reliability / AI Agents",
            technologies: "Python, FastAPI, SQLite, OpenAI API, pytest",
            image: "/images/touchstone.svg",
            description:
                "A self-verifying pipeline for SEC EDGAR 13F data that proves, auto-corrects or holds every row. It caught 5 of 5 planted faults, including a 1,302x currency-unit error, that a naive pipeline marked healthy. LLM-written checks go live only after sandbox replay and human approval.",
            link: "https://touchstone-tech.vercel.app"
        },
        {
            id: 8,
            title: "GeoTrade",
            category: "Final-Year Project",
            technologies: "Python, FastAPI, PostgreSQL/PostGIS, React, Docker",
            image: "/images/geotrade.svg",
            description:
                "A supply-chain exposure map built from public filings. Consolidated 29,442 raw listings from 6 markets into 23,020 geocoded companies, served by a 25-table PostGIS schema and a FastAPI service measured at 2-4 ms.",
            link: "https://geotrade-atlas.vercel.app"
        },
        {
            id: 9,
            title: "HeyVanilla",
            category: "Full-Stack Web App",
            technologies: "Next.js 14, TypeScript, Supabase, PostgreSQL, Docker",
            image: "/images/heyvanilla.svg",
            description:
                "A personal productivity platform with 15+ modules (habits, tasks, finance, goals, study) on a typed realtime data layer, with row-level security on all 20 tables and a hardened Docker image.",
            link: "https://heyvanilla.vercel.app"
        },
        {
            id: 10,
            title: "Placement Portal",
            category: "Java / Spring Boot",
            technologies: "Java 17, Spring Boot, JPA, MySQL, JUnit",
            image: "/images/placement.svg",
            description:
                "A campus placement management portal with role-based access, eligibility and duplicate-application rules in a transactional service layer, and JUnit-tested business logic.",
            link: "https://vu-placement-portal.onrender.com"
        }
    ],
    contact: {
        email: "priyankabana0408@gmail.com",
        github: "https://github.com/priyankabana",
        linkedin: "https://linkedin.com/in/priyankabana"
    },
    skills: {
        develop: {
            title: "DATA & AI",
            description: "Pipelines, LLM systems and data quality",
            details:
                "Building production pipelines over financial filings, retrieval-augmented LLM workflows, and rule-plus-LLM quality gates that are cheap, measurable and trustworthy.",
            tools: ["Python", "SQL", "PostgreSQL", "Neo4j", "Qdrant", "LLM APIs", "RAG", "pandas", "AWS Lambda", "ETL"]
        },
        design: {
            title: "FULL-STACK",
            description: "Backend services and modern web apps",
            details:
                "Designing APIs and schemas, and shipping secure, containerised web apps from database to UI.",
            tools: ["FastAPI", "Django", "Spring Boot", "Java", "Next.js", "React", "TypeScript", "Supabase", "Docker", "Git"]
        }
    }
};
