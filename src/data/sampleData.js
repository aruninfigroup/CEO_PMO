export const PEOPLE = ['Arun', 'Giang', 'Hafiz', 'Adam', 'Luyen', 'Hung', 'Dan', 'Trung', 'Binh', 'Shy', 'Phil', 'Nyomi', 'Julian', 'Chris', 'Anton', 'Julia'];

export const SECTIONS = [
  { id: 'v1', label: 'V1 Commerce' },
  { id: 'v2', label: 'V2 Ventures' },
  { id: 'group', label: 'Group Functions' },
  { id: 'personal', label: 'Personal' },
];

export const COMPANIES = [
  // V1 Commerce
  { id: 'amilo-vn', label: 'Amilo VN', sectionId: 'v1', currentFocus: 'Scale Hanoi warehouse ops' },
  { id: 'amilo-my', label: 'Amilo MY', sectionId: 'v1', currentFocus: 'Launch MY fulfilment hub' },
  { id: 'amilo-sg', label: 'Amilo SG', sectionId: 'v1', currentFocus: 'Enterprise client onboarding' },
  { id: 'shipx', label: 'ShipX', sectionId: 'v1', currentFocus: 'API integration with Lazada' },
  { id: 'brandlab', label: 'Brandlab', sectionId: 'v1', currentFocus: 'Q2 brand campaigns' },
  // V2 Ventures
  { id: 'volta', label: 'Volta Global', sectionId: 'v2', currentFocus: 'Series A fundraise prep' },
  { id: 'wisedrive', label: 'Wisedrive', sectionId: 'v2', currentFocus: 'Product-market fit validation' },
  { id: 'pontello', label: 'Pontello Brands', sectionId: 'v2', currentFocus: 'D2C launch strategy' },
  { id: 'asm', label: 'ASM/R1vals', sectionId: 'v2', currentFocus: 'Partnership agreements' },
  { id: 'levie', label: "L'evie Labs", sectionId: 'v2', currentFocus: 'Lab setup & hiring' },
  // Group Functions
  { id: 'fundraising', label: 'Fundraising', sectionId: 'group', currentFocus: 'Close bridge round by Q2' },
  { id: 'finance', label: 'Finance', sectionId: 'group', currentFocus: 'Group consolidation FY25' },
  { id: 'admin-hr', label: 'Admin & HR', sectionId: 'group', currentFocus: 'Q2 headcount planning' },
  { id: 'ai-tech', label: 'AI & Tech', sectionId: 'group', currentFocus: 'Internal tooling rollout' },
  { id: 'legal', label: 'Legal', sectionId: 'group', currentFocus: 'Entity restructure completion' },
  // Personal
  { id: 'personal', label: 'Personal', sectionId: 'personal', currentFocus: 'Health & family priorities' },
];

export const INITIAL_TASKS = [
  // Amilo VN
  { id: 't1', type: 'Task', title: 'Finalise Hanoi warehouse lease renewal', companyId: 'amilo-vn', owner: 'Giang', importance: 'Critical', status: 'Open', daysRemaining: 5, notes: 'Landlord wants decision by end of week. Need to confirm 2-year extension terms.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't2', type: 'Task', title: 'Hire 3 warehouse ops supervisors', companyId: 'amilo-vn', owner: 'Hung', importance: 'Normal', status: 'Open', daysRemaining: 14, notes: 'JDs posted. Interview shortlist ready.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't3', type: 'Task', title: 'Review Q1 Vietnam P&L with CFO', companyId: 'amilo-vn', owner: 'Arun', importance: 'Critical', status: 'Blocked', daysRemaining: -2, notes: 'Waiting on finance to close March books.', mustDo: true, waitingOn: true, flagged: true, completedAt: null },
  { id: 't4', type: 'Task', title: 'Negotiate customs clearance SLA with broker', companyId: 'amilo-vn', owner: 'Trung', importance: 'Normal', status: 'Open', daysRemaining: 20, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Amilo MY
  { id: 't5', type: 'Task', title: 'Sign MY fulfilment centre lease', companyId: 'amilo-my', owner: 'Adam', importance: 'Critical', status: 'Open', daysRemaining: 3, notes: 'Legal review done. Awaiting CEO sign-off.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't6', type: 'Task', title: 'Recruit MY country manager', companyId: 'amilo-my', owner: 'Nyomi', importance: 'Normal', status: 'Open', daysRemaining: 30, notes: 'Two strong candidates in final round.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't7', type: 'Task', title: 'Set up MY entity bank account', companyId: 'amilo-my', owner: 'Phil', importance: 'Critical', status: 'Blocked', daysRemaining: -5, notes: 'RHB bank requiring additional director KYC docs.', mustDo: false, waitingOn: true, flagged: true, completedAt: null },
  { id: 't8', type: 'Task', title: 'Localise MY ops playbook from VN template', companyId: 'amilo-my', owner: 'Giang', importance: 'Nice to have', status: 'Open', daysRemaining: 45, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Amilo SG
  { id: 't9', type: 'Task', title: 'Onboard Shopee SG as enterprise client', companyId: 'amilo-sg', owner: 'Arun', importance: 'Critical', status: 'Open', daysRemaining: 7, notes: 'Contract terms agreed. Need to send final MSA.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't10', type: 'Task', title: 'SG MAS compliance review', companyId: 'amilo-sg', owner: 'Anton', importance: 'Critical', status: 'Open', daysRemaining: 10, notes: 'Annual compliance check. Engage external counsel.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't11', type: 'Task', title: 'Upgrade SG tech stack to v2 WMS', companyId: 'amilo-sg', owner: 'Hafiz', importance: 'Normal', status: 'Open', daysRemaining: 60, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // ShipX
  { id: 't12', type: 'Task', title: 'Complete Lazada API integration v2', companyId: 'shipx', owner: 'Dan', importance: 'Critical', status: 'Open', daysRemaining: 8, notes: 'Dev team 70% done. QA starting this week.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't13', type: 'Task', title: 'Negotiate Shopee last-mile rate card', companyId: 'shipx', owner: 'Arun', importance: 'Normal', status: 'Open', daysRemaining: 15, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't14', type: 'Task', title: 'Fix tracking webhook reliability issue', companyId: 'shipx', owner: 'Binh', importance: 'Critical', status: 'Open', daysRemaining: 2, notes: 'Merchants reporting 15% tracking failure rate. P0 bug.', mustDo: false, waitingOn: false, flagged: true, completedAt: null },
  { id: 't15', type: 'Task', title: 'Launch ShipX SME self-serve portal', companyId: 'shipx', owner: 'Luyen', importance: 'Normal', status: 'Open', daysRemaining: 30, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Brandlab
  { id: 't16', type: 'Task', title: 'Approve Q2 brand campaign budgets', companyId: 'brandlab', owner: 'Arun', importance: 'Normal', status: 'Open', daysRemaining: 5, notes: 'Three proposals from agency. Need to pick direction.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't17', type: 'Task', title: 'Recruit Creative Director', companyId: 'brandlab', owner: 'Julia', importance: 'Critical', status: 'Open', daysRemaining: 14, notes: 'Current CD leaving end of month.', mustDo: true, waitingOn: false, flagged: true, completedAt: null },
  { id: 't18', type: 'Task', title: 'Launch TikTok Shop integration for 3 brand clients', companyId: 'brandlab', owner: 'Shy', importance: 'Normal', status: 'Open', daysRemaining: 21, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Volta Global
  { id: 't19', type: 'Task', title: 'Prepare Series A pitch deck v3', companyId: 'volta', owner: 'Arun', importance: 'Critical', status: 'Open', daysRemaining: 6, notes: 'Sequoia meeting in 6 days. Revenue slide needs updating.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't20', type: 'Task', title: 'Sign Volta Global term sheet', companyId: 'volta', owner: 'Arun', importance: 'Critical', status: 'Blocked', daysRemaining: -1, notes: 'Waiting on lead investor legal review of cap table.', mustDo: true, waitingOn: true, flagged: true, completedAt: null },
  { id: 't21', type: 'Task', title: 'Hire VP Sales for Volta', companyId: 'volta', owner: 'Julian', importance: 'Normal', status: 'Open', daysRemaining: 45, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Wisedrive
  { id: 't22', type: 'Task', title: 'Run 50-user beta for Wisedrive app', companyId: 'wisedrive', owner: 'Chris', importance: 'Critical', status: 'Open', daysRemaining: 12, notes: 'Recruit beta users from car enthusiast Facebook groups.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't23', type: 'Task', title: 'Define Wisedrive monetisation model', companyId: 'wisedrive', owner: 'Arun', importance: 'Normal', status: 'Open', daysRemaining: 20, notes: 'Subscription vs freemium decision needed.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't24', type: 'Task', title: 'Insurance partnership MOU with AXA', companyId: 'wisedrive', owner: 'Adam', importance: 'Normal', status: 'Open', daysRemaining: 30, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Pontello Brands
  { id: 't25', type: 'Task', title: 'Finalise Pontello D2C website design', companyId: 'pontello', owner: 'Shy', importance: 'Normal', status: 'Open', daysRemaining: 14, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't26', type: 'Task', title: 'Source initial Pontello product inventory', companyId: 'pontello', owner: 'Luyen', importance: 'Critical', status: 'Open', daysRemaining: 20, notes: 'Need 500 units for launch. Manufacturer in Guangzhou.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't27', type: 'Task', title: 'File Pontello trademark in SG and MY', companyId: 'pontello', owner: 'Anton', importance: 'Normal', status: 'Open', daysRemaining: 60, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // ASM/R1vals
  { id: 't28', type: 'Task', title: 'Sign ASM partnership framework agreement', companyId: 'asm', owner: 'Arun', importance: 'Critical', status: 'Open', daysRemaining: 4, notes: 'Partner waiting on our redline comments on clause 8.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't29', type: 'Task', title: 'R1vals athlete roster review', companyId: 'asm', owner: 'Julian', importance: 'Normal', status: 'Open', daysRemaining: 15, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't30', type: 'Task', title: 'ASM revenue share model sign-off', companyId: 'asm', owner: 'Phil', importance: 'Normal', status: 'Blocked', daysRemaining: 10, notes: 'Waiting on finance model from Hafiz.', mustDo: false, waitingOn: true, flagged: false, completedAt: null },
  // L'evie Labs
  { id: 't31', type: 'Task', title: "Sign L'evie lab space lease", companyId: 'levie', owner: 'Arun', importance: 'Critical', status: 'Open', daysRemaining: 9, notes: 'One-north science park option preferred.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't32', type: 'Task', title: "Hire Head of R&D for L'evie", companyId: 'levie', owner: 'Nyomi', importance: 'Normal', status: 'Open', daysRemaining: 30, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't33', type: 'Task', title: "L'evie regulatory pre-submission meeting with HSA", companyId: 'levie', owner: 'Anton', importance: 'Normal', status: 'Open', daysRemaining: 25, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Fundraising
  { id: 't34', type: 'Task', title: 'Close bridge round — $2M by end of Q2', companyId: 'fundraising', owner: 'Arun', importance: 'Critical', status: 'Open', daysRemaining: 75, notes: 'Lead investor Vertex committed. Need 2 more co-investors.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't35', type: 'Task', title: 'Prepare investor data room', companyId: 'fundraising', owner: 'Phil', importance: 'Critical', status: 'Open', daysRemaining: 7, notes: 'Docusend link to be shared with Sequoia next week.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't36', type: 'Task', title: 'LP updates newsletter Q1', companyId: 'fundraising', owner: 'Arun', importance: 'Normal', status: 'Open', daysRemaining: 10, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Finance
  { id: 't37', type: 'Task', title: 'Group FY25 consolidation — close March books', companyId: 'finance', owner: 'Phil', importance: 'Critical', status: 'Open', daysRemaining: 5, notes: 'All entities need to submit by Friday.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't38', type: 'Task', title: 'Set up intercompany loan agreements', companyId: 'finance', owner: 'Anton', importance: 'Normal', status: 'Open', daysRemaining: 20, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't39', type: 'Task', title: 'Cashflow forecast model Q2-Q3', companyId: 'finance', owner: 'Hafiz', importance: 'Normal', status: 'Open', daysRemaining: 14, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Admin & HR
  { id: 't40', type: 'Task', title: 'Q2 headcount plan across all entities', companyId: 'admin-hr', owner: 'Nyomi', importance: 'Critical', status: 'Open', daysRemaining: 10, notes: '32 open headcount across group. Need approval by next board meeting.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't41', type: 'Task', title: 'Implement group-wide leave management system', companyId: 'admin-hr', owner: 'Julia', importance: 'Normal', status: 'Open', daysRemaining: 30, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't42', type: 'Task', title: 'Update employment contracts for SG entities post-restructure', companyId: 'admin-hr', owner: 'Anton', importance: 'Normal', status: 'Open', daysRemaining: 21, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // AI & Tech
  { id: 't43', type: 'Task', title: 'Deploy InfiGroup OS internal tool to all teams', companyId: 'ai-tech', owner: 'Dan', importance: 'Critical', status: 'Open', daysRemaining: 14, notes: 'CEO dashboard and ops tool. React app, deploy to Vercel.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't44', type: 'Task', title: 'Evaluate AI agents for finance automation', companyId: 'ai-tech', owner: 'Hafiz', importance: 'Normal', status: 'Open', daysRemaining: 30, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't45', type: 'Task', title: 'Set up group SSO and identity management', companyId: 'ai-tech', owner: 'Binh', importance: 'Normal', status: 'Open', daysRemaining: 45, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Legal
  { id: 't46', type: 'Task', title: 'Complete SG entity restructure filing', companyId: 'legal', owner: 'Anton', importance: 'Critical', status: 'Open', daysRemaining: 7, notes: 'ACRA filing due. All shareholder resolutions signed.', mustDo: true, waitingOn: false, flagged: false, completedAt: null },
  { id: 't47', type: 'Task', title: 'Draft shareholder agreement v2 for Volta', companyId: 'legal', owner: 'Chris', importance: 'Normal', status: 'Open', daysRemaining: 15, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't48', type: 'Task', title: 'IP assignment agreements for all founders', companyId: 'legal', owner: 'Anton', importance: 'Normal', status: 'Open', daysRemaining: 21, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  // Personal
  { id: 't49', type: 'Task', title: 'Book annual health screening', companyId: 'personal', owner: 'Arun', importance: 'Normal', status: 'Open', daysRemaining: 30, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't50', type: 'Task', title: 'Family holiday planning — Bali trip', companyId: 'personal', owner: 'Arun', importance: 'Nice to have', status: 'Open', daysRemaining: 60, notes: 'Target May school holidays.', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
  { id: 't51', type: 'Task', title: 'Review personal investment portfolio', companyId: 'personal', owner: 'Arun', importance: 'Normal', status: 'Open', daysRemaining: 14, notes: '', mustDo: false, waitingOn: false, flagged: false, completedAt: null },
];

export const INITIAL_IDEAS = [
  { id: 'i1', type: 'Idea', title: 'Amilo VN — robot sorting system for Hanoi warehouse', companyId: 'amilo-vn', notes: 'Could cut pick-pack time by 40%. Look at Geek+ or GreyOrange.' },
  { id: 'i2', type: 'Idea', title: 'ShipX — white-label last-mile for SMEs', companyId: 'shipx', notes: 'Huge untapped market. Could be $1M ARR by end of year.' },
  { id: 'i3', type: 'Idea', title: 'Brandlab — AI-generated ad creative offering', companyId: 'brandlab', notes: 'Use Claude API to generate brand-safe creative variants.' },
  { id: 'i4', type: 'Idea', title: 'Wisedrive — fleet management B2B pivot', companyId: 'wisedrive', notes: 'Corporate fleet is 10x larger TAM than consumer.' },
  { id: 'i5', type: 'Idea', title: 'Volta — carbon credit integration for logistics', companyId: 'volta', notes: 'Partners want ESG metrics. Could be differentiator.' },
  { id: 'i6', type: 'Idea', title: 'AI & Tech — shared data warehouse across all entities', companyId: 'ai-tech', notes: 'BigQuery or Snowflake. Single source of truth for all P&Ls.' },
];
