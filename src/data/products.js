export const PRODUCTS_DATA = [
    {
        id: 'nfc-smart-card',
        number: '01',
        slug: 'nfc-smart-card',
        family: 'NFC Digital Identity',
        name: 'NFC Smart Card',
        category: 'Digital Identity Solutions | Business & Personal',
        tagline: 'One tap. Every connection.',
        badge: 'For Business & Personal Use · Coming Soon',
        shortDescription:
            'A unified contactless NFC identity card engineered for both business networking and personal portfolios. Share company branding, services, and enquiry forms—or your projects, skills, and resume with a single tap.',
        description:
            'SignBridge NFC Smart Card bridges physical interaction with instant digital connectivity. Engineered with an ultra-responsive contactless NFC chip and custom finish, one single card powers both your professional business profile and your personal portfolio. Tap against any compatible smartphone to share your services, products, resume, contact channels, and portfolio instantly—with zero apps required.',
        problemStatement:
            'Carrying traditional paper visiting cards and sharing multiple fragmented links (resumes, LinkedIn, GitHub, portfolios, WhatsApp) creates friction, leads to lost connections, and requires costly reprints whenever contact information or offerings change.',
        ourSolution:
            'SignBridge NFC Smart Card unifies your complete professional and personal presence into one physical contactless card backed by dual-mode digital profiles. Seamlessly toggle between your Company Business Profile and your Personal Career Portfolio from a single intuitive dashboard, and share everything with a single tap—no app download needed.',
        highlightedFeatures: [
            'For Business & Personal Use (Dual-Mode)',
            'One tap contactless NFC & unique URL',
            'Company branding, services & lead capture',
            'Personal portfolio, projects & resume download'
        ],
        features: [
            'Personalized contactless NFC Smart Card with premium finish',
            'Dual-mode profile: Switch between Business & Personal modes',
            'Digital company profile with logo, branding & services showcase',
            'Personal portfolio with projects, technical skills & achievements',
            'One-tap resume (PDF) download for recruiters & clients',
            'Direct WhatsApp, email & phone quick-action triggers',
            'Social & developer links (LinkedIn, GitHub, Instagram, Web)',
            'Business enquiry and lead capture form',
            'Unique personal and business profile URLs (e.g., signbridge.click/u/...)',
            'Real-time cloud profile management dashboard for instant updates'
        ],
        howItWorks: [
            {
                step: '01',
                title: 'Configure Your Profiles',
                desc: 'Set up your Business profile (branding, services, lead capture) and Personal portfolio (projects, skills, resume) in the dashboard.'
            },
            {
                step: '02',
                title: 'Tap Card to Any Smartphone',
                desc: 'Hold your NFC Smart Card to the back of any modern iPhone or Android smartphone during meetings, networking, or interviews.'
            },
            {
                step: '03',
                title: 'Instant Profile Experience',
                desc: 'Your tailored digital profile opens instantly in their mobile browser with zero app installation required.'
            },
            {
                step: '04',
                title: 'Connect & Convert',
                desc: 'Visitors browse your offerings, message on WhatsApp, download your resume, save contact details, or submit enquiries directly.'
            }
        ],
        targetAudience: [
            'Entrepreneurs & Startups',
            'Business Professionals & Sales Teams',
            'Freelancers & Consultants',
            'Developers & Designers',
            'College Students & Job Seekers',
            'Content Creators & Agencies'
        ],
        visualType: 'nfc-smart-card',
        image: '/assets/nfc-smart-card.webp',
        accentColor: '#2563eb',
        ctaLabel: 'Join Waitlist (Coming Soon)',
        isComingSoon: true
    },
    {
        id: 'farmcargo',
        number: '02',
        slug: 'farmcargo',
        family: 'Agricultural Procurement Intelligence',
        name: 'FarmCargo',
        category: 'Agricultural Technology | Procurement Intelligence',
        tagline: 'Predict. Plan. Procure.',
        shortDescription:
            'An agricultural procurement intelligence and operations management platform transforming traditional procurement into a predictable, organized, data-driven lifecycle.',
        description:
            'FarmCargo is an agricultural procurement intelligence and operations management platform designed to transform traditional agricultural procurement into a predictable, organized, and data-driven process. It helps procurement centres understand how much agricultural produce will arrive, when it will arrive, where it will come from, and what resources will be required. FarmCargo is not simply a farmer-registration application or agricultural marketplace. It focuses on the complete procurement lifecycle, beginning before harvest and continuing through procurement operations.',
        problemStatement:
            'Agricultural procurement centres often lack visibility into upcoming harvest volumes, arrival dates, and origin locations. Without pre-harvest arrival intelligence, centres face sudden intake surges, unscheduled queues, warehouse capacity strain, and manual receipt and payment bottlenecks.',
        ourSolution:
            'FarmCargo manages the complete procurement lifecycle—from cultivation tracking and pre-harvest crop arrival prediction to smart token and slot scheduling, procurement centre capacity monitoring, quality verification, weighing management, procurement receipts, payment tracking, and administrative analytics.',
        highlightedFeatures: [
            'Crop arrival quantity & timing prediction',
            'Smart procurement scheduling & token slots',
            'Centre capacity monitoring & quality check',
            'Weighing, receipts, payment tracking & analytics'
        ],
        features: [
            'Farmer and cultivation information management',
            'Harvest planning',
            'Crop arrival quantity prediction',
            'Expected arrival time and location estimation',
            'Smart procurement scheduling',
            'Token and slot management',
            'Procurement centre capacity monitoring',
            'Crop quality verification',
            'Weighing management',
            'Procurement receipts',
            'Payment tracking',
            'Administrative dashboards and analytics'
        ],
        howItWorks: [
            {
                step: '01',
                title: 'Pre-Harvest Cultivation & Planning',
                desc: 'Capture farmer and cultivation records early to establish visibility into upcoming harvest schedules.'
            },
            {
                step: '02',
                title: 'Arrival Quantity & Location Prediction',
                desc: 'Estimate how much produce will arrive, expected arrival windows, and originating locations so centres can prepare resources.'
            },
            {
                step: '03',
                title: 'Smart Slot & Capacity Scheduling',
                desc: 'Coordinate token and slot allocations against real-time procurement centre and warehouse capacity.'
            },
            {
                step: '04',
                title: 'Quality Verification & Weighing',
                desc: 'Standardize intake operations with structured crop quality verification and digital weighing management.'
            },
            {
                step: '05',
                title: 'Receipts, Payments & Admin Analytics',
                desc: 'Issue procurement receipts, track payment status, and monitor centre-wide operations through administrative dashboards.'
            }
        ],
        targetAudience: [
            'Agricultural Procurement Centres',
            'Mill Operators',
            'Procurement Organizations',
            'Agricultural Institutions'
        ],
        visualType: 'farmcargo',
        accentColor: '#10b981',
        ctaLabel: 'Request FarmCargo Demo'
    }
];

export const NFC_COMPARISON_ROWS = [
    {
        dimension: 'Primary Purpose',
        business: 'Share company identity, products/services catalog, and capture business enquiries.',
        portfolio: 'Showcase personal qualifications, technical skills, projects, achievements, and resume.'
    },
    {
        dimension: 'Profile Content',
        business: 'Business logo & branding, services catalog, company contact, website & enquiry form.',
        portfolio: 'Profile photo & bio, education, technical skills, project portfolio & downloadable resume.'
    },
    {
        dimension: 'Key Integrations',
        business: 'WhatsApp business chat, email, website link, social channels & lead capture.',
        portfolio: 'GitHub, LinkedIn, social media links, direct contact & unique personal profile URL.'
    },
    {
        dimension: 'Management Experience',
        business: 'Customizable dashboard tailored for corporate brand, services & team updates.',
        portfolio: 'Secure profile dashboard tailored for career, project & CV updates.'
    },
    {
        dimension: 'Ideal Scenarios',
        business: 'Client meetings, corporate conferences, product demos, vendor partnerships.',
        portfolio: 'Interviews, campus placements, tech meetups, hackathons, freelance proposals.'
    }
];

export function getProductBySlug(slug) {
    if (slug === 'nfc-business-card' || slug === 'nfc-portfolio-card') {
        return PRODUCTS_DATA.find((product) => product.id === 'nfc-smart-card');
    }
    return PRODUCTS_DATA.find((product) => product.slug === slug);
}
