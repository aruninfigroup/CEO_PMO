/**
 * Seed script — inserts sample data into Supabase tables.
 * Run once after creating the tables:
 *   node scripts/seed.js
 *
 * Required Supabase tables and columns:
 *
 *  entities  : id (uuid PK), label (text), section_id (text),
 *              current_focus (text), sort_order (int)
 *
 *  tasks     : id (uuid PK), type (text), title (text), company_id (uuid FK→entities),
 *              owner (text), importance (text), status (text),
 *              days_remaining (int), notes (text), must_do (bool),
 *              waiting_on (bool), flagged (bool), completed_at (timestamptz),
 *              created_at (timestamptz DEFAULT now())
 *
 *  ideas     : id (uuid PK), type (text), title (text),
 *              company_id (uuid FK→entities), notes (text)
 *
 *  people    : id (uuid PK), name (text NOT NULL), created_at (timestamptz DEFAULT now())
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

// ---- Stable UUID mapping for each entity ----
// These are fixed so the seed is idempotent (safe to re-run).
const E = {
  'amilo-vn':    'a1000001-0000-0000-0000-000000000001',
  'amilo-my':    'a1000002-0000-0000-0000-000000000002',
  'amilo-sg':    'a1000003-0000-0000-0000-000000000003',
  'shipx':       'a1000004-0000-0000-0000-000000000004',
  'brandlab':    'a1000005-0000-0000-0000-000000000005',
  'volta':       'a1000006-0000-0000-0000-000000000006',
  'wisedrive':   'a1000007-0000-0000-0000-000000000007',
  'pontello':    'a1000008-0000-0000-0000-000000000008',
  'asm':         'a1000009-0000-0000-0000-000000000009',
  'levie':       'a1000010-0000-0000-0000-000000000010',
  'fundraising': 'a1000011-0000-0000-0000-000000000011',
  'finance':     'a1000012-0000-0000-0000-000000000012',
  'admin-hr':    'a1000013-0000-0000-0000-000000000013',
  'ai-tech':     'a1000014-0000-0000-0000-000000000014',
  'legal':       'a1000015-0000-0000-0000-000000000015',
  'personal':    'a1000016-0000-0000-0000-000000000016',
};

// ---- Sample data ----

const COMPANIES = [
  { key: 'amilo-vn',    label: 'Amilo VN',         sectionId: 'v1',       currentFocus: 'Scale Hanoi warehouse ops' },
  { key: 'amilo-my',    label: 'Amilo MY',         sectionId: 'v1',       currentFocus: 'Launch MY fulfilment hub' },
  { key: 'amilo-sg',    label: 'Amilo SG',         sectionId: 'v1',       currentFocus: 'Enterprise client onboarding' },
  { key: 'shipx',       label: 'ShipX',            sectionId: 'v1',       currentFocus: 'API integration with Lazada' },
  { key: 'brandlab',    label: 'Brandlab',         sectionId: 'v1',       currentFocus: 'Q2 brand campaigns' },
  { key: 'volta',       label: 'Volta Global',     sectionId: 'v2',       currentFocus: 'Series A fundraise prep' },
  { key: 'wisedrive',   label: 'Wisedrive',        sectionId: 'v2',       currentFocus: 'Product-market fit validation' },
  { key: 'pontello',    label: 'Pontello Brands',  sectionId: 'v2',       currentFocus: 'D2C launch strategy' },
  { key: 'asm',         label: 'ASM/R1vals',       sectionId: 'v2',       currentFocus: 'Partnership agreements' },
  { key: 'levie',       label: "L'evie Labs",      sectionId: 'v2',       currentFocus: 'Lab setup & hiring' },
  { key: 'fundraising', label: 'Fundraising',      sectionId: 'group',    currentFocus: 'Close bridge round by Q2' },
  { key: 'finance',     label: 'Finance',          sectionId: 'group',    currentFocus: 'Group consolidation FY25' },
  { key: 'admin-hr',    label: 'Admin & HR',       sectionId: 'group',    currentFocus: 'Q2 headcount planning' },
  { key: 'ai-tech',     label: 'AI & Tech',        sectionId: 'group',    currentFocus: 'Internal tooling rollout' },
  { key: 'legal',       label: 'Legal',            sectionId: 'group',    currentFocus: 'Entity restructure completion' },
  { key: 'personal',    label: 'Personal',         sectionId: 'personal', currentFocus: 'Health & family priorities' },
];

const INITIAL_TASKS = [
  { id: 't001', companyKey: 'amilo-vn',    owner: 'Giang',  importance: 'Critical',     status: 'Open',    daysRemaining: 5,  mustDo: true,  waitingOn: false, flagged: false, title: 'Finalise Hanoi warehouse lease renewal',           notes: 'Landlord wants decision by end of week. Need to confirm 2-year extension terms.' },
  { id: 't002', companyKey: 'amilo-vn',    owner: 'Hung',   importance: 'Normal',       status: 'Open',    daysRemaining: 14, mustDo: false, waitingOn: false, flagged: false, title: 'Hire 3 warehouse ops supervisors',                 notes: 'JDs posted. Interview shortlist ready.' },
  { id: 't003', companyKey: 'amilo-vn',    owner: 'Arun',   importance: 'Critical',     status: 'Blocked', daysRemaining: -2, mustDo: true,  waitingOn: true,  flagged: true,  title: 'Review Q1 Vietnam P&L with CFO',                  notes: 'Waiting on finance to close March books.' },
  { id: 't004', companyKey: 'amilo-vn',    owner: 'Trung',  importance: 'Normal',       status: 'Open',    daysRemaining: 20, mustDo: false, waitingOn: false, flagged: false, title: 'Negotiate customs clearance SLA with broker',      notes: '' },
  { id: 't005', companyKey: 'amilo-my',    owner: 'Adam',   importance: 'Critical',     status: 'Open',    daysRemaining: 3,  mustDo: true,  waitingOn: false, flagged: false, title: 'Sign MY fulfilment centre lease',                  notes: 'Legal review done. Awaiting CEO sign-off.' },
  { id: 't006', companyKey: 'amilo-my',    owner: 'Nyomi',  importance: 'Normal',       status: 'Open',    daysRemaining: 30, mustDo: false, waitingOn: false, flagged: false, title: 'Recruit MY country manager',                       notes: 'Two strong candidates in final round.' },
  { id: 't007', companyKey: 'amilo-my',    owner: 'Phil',   importance: 'Critical',     status: 'Blocked', daysRemaining: -5, mustDo: false, waitingOn: true,  flagged: true,  title: 'Set up MY entity bank account',                   notes: 'RHB bank requiring additional director KYC docs.' },
  { id: 't008', companyKey: 'amilo-my',    owner: 'Giang',  importance: 'Nice to have', status: 'Open',    daysRemaining: 45, mustDo: false, waitingOn: false, flagged: false, title: 'Localise MY ops playbook from VN template',        notes: '' },
  { id: 't009', companyKey: 'amilo-sg',    owner: 'Arun',   importance: 'Critical',     status: 'Open',    daysRemaining: 7,  mustDo: true,  waitingOn: false, flagged: false, title: 'Onboard Shopee SG as enterprise client',           notes: 'Contract terms agreed. Need to send final MSA.' },
  { id: 't010', companyKey: 'amilo-sg',    owner: 'Anton',  importance: 'Critical',     status: 'Open',    daysRemaining: 10, mustDo: false, waitingOn: false, flagged: false, title: 'SG MAS compliance review',                        notes: 'Annual compliance check. Engage external counsel.' },
  { id: 't011', companyKey: 'amilo-sg',    owner: 'Hafiz',  importance: 'Normal',       status: 'Open',    daysRemaining: 60, mustDo: false, waitingOn: false, flagged: false, title: 'Upgrade SG tech stack to v2 WMS',                  notes: '' },
  { id: 't012', companyKey: 'shipx',       owner: 'Dan',    importance: 'Critical',     status: 'Open',    daysRemaining: 8,  mustDo: true,  waitingOn: false, flagged: false, title: 'Complete Lazada API integration v2',               notes: 'Dev team 70% done. QA starting this week.' },
  { id: 't013', companyKey: 'shipx',       owner: 'Arun',   importance: 'Normal',       status: 'Open',    daysRemaining: 15, mustDo: false, waitingOn: false, flagged: false, title: 'Negotiate Shopee last-mile rate card',             notes: '' },
  { id: 't014', companyKey: 'shipx',       owner: 'Binh',   importance: 'Critical',     status: 'Open',    daysRemaining: 2,  mustDo: false, waitingOn: false, flagged: true,  title: 'Fix tracking webhook reliability issue',           notes: 'Merchants reporting 15% tracking failure rate. P0 bug.' },
  { id: 't015', companyKey: 'shipx',       owner: 'Luyen',  importance: 'Normal',       status: 'Open',    daysRemaining: 30, mustDo: false, waitingOn: false, flagged: false, title: 'Launch ShipX SME self-serve portal',              notes: '' },
  { id: 't016', companyKey: 'brandlab',    owner: 'Arun',   importance: 'Normal',       status: 'Open',    daysRemaining: 5,  mustDo: false, waitingOn: false, flagged: false, title: 'Approve Q2 brand campaign budgets',               notes: 'Three proposals from agency. Need to pick direction.' },
  { id: 't017', companyKey: 'brandlab',    owner: 'Julia',  importance: 'Critical',     status: 'Open',    daysRemaining: 14, mustDo: true,  waitingOn: false, flagged: true,  title: 'Recruit Creative Director',                        notes: 'Current CD leaving end of month.' },
  { id: 't018', companyKey: 'brandlab',    owner: 'Shy',    importance: 'Normal',       status: 'Open',    daysRemaining: 21, mustDo: false, waitingOn: false, flagged: false, title: 'Launch TikTok Shop integration for 3 brand clients', notes: '' },
  { id: 't019', companyKey: 'volta',       owner: 'Arun',   importance: 'Critical',     status: 'Open',    daysRemaining: 6,  mustDo: true,  waitingOn: false, flagged: false, title: 'Prepare Series A pitch deck v3',                  notes: 'Sequoia meeting in 6 days. Revenue slide needs updating.' },
  { id: 't020', companyKey: 'volta',       owner: 'Arun',   importance: 'Critical',     status: 'Blocked', daysRemaining: -1, mustDo: true,  waitingOn: true,  flagged: true,  title: 'Sign Volta Global term sheet',                     notes: 'Waiting on lead investor legal review of cap table.' },
  { id: 't021', companyKey: 'volta',       owner: 'Julian', importance: 'Normal',       status: 'Open',    daysRemaining: 45, mustDo: false, waitingOn: false, flagged: false, title: 'Hire VP Sales for Volta',                          notes: '' },
  { id: 't022', companyKey: 'wisedrive',   owner: 'Chris',  importance: 'Critical',     status: 'Open',    daysRemaining: 12, mustDo: false, waitingOn: false, flagged: false, title: 'Run 50-user beta for Wisedrive app',               notes: 'Recruit beta users from car enthusiast Facebook groups.' },
  { id: 't023', companyKey: 'wisedrive',   owner: 'Arun',   importance: 'Normal',       status: 'Open',    daysRemaining: 20, mustDo: false, waitingOn: false, flagged: false, title: 'Define Wisedrive monetisation model',              notes: 'Subscription vs freemium decision needed.' },
  { id: 't024', companyKey: 'wisedrive',   owner: 'Adam',   importance: 'Normal',       status: 'Open',    daysRemaining: 30, mustDo: false, waitingOn: false, flagged: false, title: 'Insurance partnership MOU with AXA',               notes: '' },
  { id: 't025', companyKey: 'pontello',    owner: 'Shy',    importance: 'Normal',       status: 'Open',    daysRemaining: 14, mustDo: false, waitingOn: false, flagged: false, title: 'Finalise Pontello D2C website design',             notes: '' },
  { id: 't026', companyKey: 'pontello',    owner: 'Luyen',  importance: 'Critical',     status: 'Open',    daysRemaining: 20, mustDo: false, waitingOn: false, flagged: false, title: 'Source initial Pontello product inventory',        notes: 'Need 500 units for launch. Manufacturer in Guangzhou.' },
  { id: 't027', companyKey: 'pontello',    owner: 'Anton',  importance: 'Normal',       status: 'Open',    daysRemaining: 60, mustDo: false, waitingOn: false, flagged: false, title: 'File Pontello trademark in SG and MY',             notes: '' },
  { id: 't028', companyKey: 'asm',         owner: 'Arun',   importance: 'Critical',     status: 'Open',    daysRemaining: 4,  mustDo: true,  waitingOn: false, flagged: false, title: 'Sign ASM partnership framework agreement',         notes: 'Partner waiting on our redline comments on clause 8.' },
  { id: 't029', companyKey: 'asm',         owner: 'Julian', importance: 'Normal',       status: 'Open',    daysRemaining: 15, mustDo: false, waitingOn: false, flagged: false, title: 'R1vals athlete roster review',                     notes: '' },
  { id: 't030', companyKey: 'asm',         owner: 'Phil',   importance: 'Normal',       status: 'Blocked', daysRemaining: 10, mustDo: false, waitingOn: true,  flagged: false, title: 'ASM revenue share model sign-off',                 notes: 'Waiting on finance model from Hafiz.' },
  { id: 't031', companyKey: 'levie',       owner: 'Arun',   importance: 'Critical',     status: 'Open',    daysRemaining: 9,  mustDo: false, waitingOn: false, flagged: false, title: "Sign L'evie lab space lease",                      notes: 'One-north science park option preferred.' },
  { id: 't032', companyKey: 'levie',       owner: 'Nyomi',  importance: 'Normal',       status: 'Open',    daysRemaining: 30, mustDo: false, waitingOn: false, flagged: false, title: "Hire Head of R&D for L'evie",                      notes: '' },
  { id: 't033', companyKey: 'levie',       owner: 'Anton',  importance: 'Normal',       status: 'Open',    daysRemaining: 25, mustDo: false, waitingOn: false, flagged: false, title: "L'evie regulatory pre-submission meeting with HSA", notes: '' },
  { id: 't034', companyKey: 'fundraising', owner: 'Arun',   importance: 'Critical',     status: 'Open',    daysRemaining: 75, mustDo: true,  waitingOn: false, flagged: false, title: 'Close bridge round — $2M by end of Q2',            notes: 'Lead investor Vertex committed. Need 2 more co-investors.' },
  { id: 't035', companyKey: 'fundraising', owner: 'Phil',   importance: 'Critical',     status: 'Open',    daysRemaining: 7,  mustDo: false, waitingOn: false, flagged: false, title: 'Prepare investor data room',                       notes: 'Docusend link to be shared with Sequoia next week.' },
  { id: 't036', companyKey: 'fundraising', owner: 'Arun',   importance: 'Normal',       status: 'Open',    daysRemaining: 10, mustDo: false, waitingOn: false, flagged: false, title: 'LP updates newsletter Q1',                         notes: '' },
  { id: 't037', companyKey: 'finance',     owner: 'Phil',   importance: 'Critical',     status: 'Open',    daysRemaining: 5,  mustDo: true,  waitingOn: false, flagged: false, title: 'Group FY25 consolidation — close March books',     notes: 'All entities need to submit by Friday.' },
  { id: 't038', companyKey: 'finance',     owner: 'Anton',  importance: 'Normal',       status: 'Open',    daysRemaining: 20, mustDo: false, waitingOn: false, flagged: false, title: 'Set up intercompany loan agreements',               notes: '' },
  { id: 't039', companyKey: 'finance',     owner: 'Hafiz',  importance: 'Normal',       status: 'Open',    daysRemaining: 14, mustDo: false, waitingOn: false, flagged: false, title: 'Cashflow forecast model Q2-Q3',                    notes: '' },
  { id: 't040', companyKey: 'admin-hr',    owner: 'Nyomi',  importance: 'Critical',     status: 'Open',    daysRemaining: 10, mustDo: false, waitingOn: false, flagged: false, title: 'Q2 headcount plan across all entities',            notes: '32 open headcount across group. Need approval by next board meeting.' },
  { id: 't041', companyKey: 'admin-hr',    owner: 'Julia',  importance: 'Normal',       status: 'Open',    daysRemaining: 30, mustDo: false, waitingOn: false, flagged: false, title: 'Implement group-wide leave management system',     notes: '' },
  { id: 't042', companyKey: 'admin-hr',    owner: 'Anton',  importance: 'Normal',       status: 'Open',    daysRemaining: 21, mustDo: false, waitingOn: false, flagged: false, title: 'Update employment contracts for SG entities post-restructure', notes: '' },
  { id: 't043', companyKey: 'ai-tech',     owner: 'Dan',    importance: 'Critical',     status: 'Open',    daysRemaining: 14, mustDo: true,  waitingOn: false, flagged: false, title: 'Deploy Pulse internal tool to all teams',          notes: 'CEO dashboard and ops tool. React app, deploy to Vercel.' },
  { id: 't044', companyKey: 'ai-tech',     owner: 'Hafiz',  importance: 'Normal',       status: 'Open',    daysRemaining: 30, mustDo: false, waitingOn: false, flagged: false, title: 'Evaluate AI agents for finance automation',        notes: '' },
  { id: 't045', companyKey: 'ai-tech',     owner: 'Binh',   importance: 'Normal',       status: 'Open',    daysRemaining: 45, mustDo: false, waitingOn: false, flagged: false, title: 'Set up group SSO and identity management',         notes: '' },
  { id: 't046', companyKey: 'legal',       owner: 'Anton',  importance: 'Critical',     status: 'Open',    daysRemaining: 7,  mustDo: true,  waitingOn: false, flagged: false, title: 'Complete SG entity restructure filing',            notes: 'ACRA filing due. All shareholder resolutions signed.' },
  { id: 't047', companyKey: 'legal',       owner: 'Chris',  importance: 'Normal',       status: 'Open',    daysRemaining: 15, mustDo: false, waitingOn: false, flagged: false, title: 'Draft shareholder agreement v2 for Volta',         notes: '' },
  { id: 't048', companyKey: 'legal',       owner: 'Anton',  importance: 'Normal',       status: 'Open',    daysRemaining: 21, mustDo: false, waitingOn: false, flagged: false, title: 'IP assignment agreements for all founders',        notes: '' },
  { id: 't049', companyKey: 'personal',    owner: 'Arun',   importance: 'Normal',       status: 'Open',    daysRemaining: 30, mustDo: false, waitingOn: false, flagged: false, title: 'Book annual health screening',                     notes: '' },
  { id: 't050', companyKey: 'personal',    owner: 'Arun',   importance: 'Nice to have', status: 'Open',    daysRemaining: 60, mustDo: false, waitingOn: false, flagged: false, title: 'Family holiday planning — Bali trip',              notes: 'Target May school holidays.' },
  { id: 't051', companyKey: 'personal',    owner: 'Arun',   importance: 'Normal',       status: 'Open',    daysRemaining: 14, mustDo: false, waitingOn: false, flagged: false, title: 'Review personal investment portfolio',             notes: '' },
];

const INITIAL_IDEAS = [
  { id: 'i001', companyKey: 'amilo-vn',  title: 'Amilo VN — robot sorting system for Hanoi warehouse',   notes: 'Could cut pick-pack time by 40%. Look at Geek+ or GreyOrange.' },
  { id: 'i002', companyKey: 'shipx',     title: 'ShipX — white-label last-mile for SMEs',                notes: 'Huge untapped market. Could be $1M ARR by end of year.' },
  { id: 'i003', companyKey: 'brandlab',  title: 'Brandlab — AI-generated ad creative offering',          notes: 'Use Claude API to generate brand-safe creative variants.' },
  { id: 'i004', companyKey: 'wisedrive', title: 'Wisedrive — fleet management B2B pivot',                notes: 'Corporate fleet is 10x larger TAM than consumer.' },
  { id: 'i005', companyKey: 'volta',     title: 'Volta — carbon credit integration for logistics',       notes: 'Partners want ESG metrics. Could be differentiator.' },
  { id: 'i006', companyKey: 'ai-tech',   title: 'AI & Tech — shared data warehouse across all entities', notes: 'BigQuery or Snowflake. Single source of truth for all P&Ls.' },
];

// Stable UUIDs for seed people — fixed so re-running is idempotent
const SEED_PEOPLE = [
  { id: 'b0000001-0000-0000-0000-000000000001', name: 'Arun' },
  { id: 'b0000002-0000-0000-0000-000000000002', name: 'Giang' },
  { id: 'b0000003-0000-0000-0000-000000000003', name: 'Hafiz' },
  { id: 'b0000004-0000-0000-0000-000000000004', name: 'Adam' },
  { id: 'b0000005-0000-0000-0000-000000000005', name: 'Luyen' },
  { id: 'b0000006-0000-0000-0000-000000000006', name: 'Hung' },
  { id: 'b0000007-0000-0000-0000-000000000007', name: 'Dan' },
  { id: 'b0000008-0000-0000-0000-000000000008', name: 'Trung' },
  { id: 'b0000009-0000-0000-0000-000000000009', name: 'Binh' },
  { id: 'b0000010-0000-0000-0000-000000000010', name: 'Shy' },
  { id: 'b0000011-0000-0000-0000-000000000011', name: 'Phil' },
  { id: 'b0000012-0000-0000-0000-000000000012', name: 'Nyomi' },
  { id: 'b0000013-0000-0000-0000-000000000013', name: 'Julian' },
  { id: 'b0000014-0000-0000-0000-000000000014', name: 'Chris' },
  { id: 'b0000015-0000-0000-0000-000000000015', name: 'Anton' },
  { id: 'b0000016-0000-0000-0000-000000000016', name: 'Julia' },
];

// ---- Seed ----

// Generate a stable UUID from a short seed string (deterministic, format-valid)
function stableUUID(shortId) {
  // Pad/hash the id into a UUID-shaped string
  const hex = Buffer.from(shortId.padEnd(16, '0').slice(0, 16)).toString('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-a${hex.slice(16,19)}-${hex.slice(19,31).padEnd(12,'0')}`;
}

async function seed() {
  console.log('Seeding Supabase database…\n');

  // Entities
  const entities = COMPANIES.map((c, i) => ({
    id: E[c.key],
    label: c.label,
    section_id: c.sectionId,
    current_focus: c.currentFocus || '',
    sort_order: i,
  }));
  const { error: entErr } = await supabase.from('entities').upsert(entities, { onConflict: 'id' });
  if (entErr) { console.error('  ✗ entities:', entErr.message); }
  else console.log(`  ✓ Seeded ${entities.length} entities`);

  // Tasks — use stable UUIDs derived from the task short-id
  const tasks = INITIAL_TASKS.map(t => ({
    id: stableUUID(t.id),
    type: 'Task',
    title: t.title,
    company_id: E[t.companyKey],
    owner: t.owner,
    importance: t.importance,
    status: t.status,
    days_remaining: t.daysRemaining,
    notes: t.notes || '',
    must_do: t.mustDo,
    waiting_on: t.waitingOn,
    flagged: t.flagged,
    completed_at: null,
  }));
  const { error: taskErr } = await supabase.from('tasks').upsert(tasks, { onConflict: 'id' });
  if (taskErr) { console.error('  ✗ tasks:', taskErr.message); }
  else console.log(`  ✓ Seeded ${tasks.length} tasks`);

  // Ideas
  const ideas = INITIAL_IDEAS.map(i => ({
    id: stableUUID(i.id),
    type: 'Idea',
    title: i.title,
    company_id: E[i.companyKey],
    notes: i.notes || '',
  }));
  const { error: ideaErr } = await supabase.from('ideas').upsert(ideas, { onConflict: 'id' });
  if (ideaErr) { console.error('  ✗ ideas:', ideaErr.message); }
  else console.log(`  ✓ Seeded ${ideas.length} ideas`);

  // People — seed the 16 names into the people table
  const { error: peopleErr } = await supabase.from('people').upsert(SEED_PEOPLE, { onConflict: 'id' });
  if (peopleErr) {
    console.error('  ✗ people:', peopleErr.message);
    console.error('    → Create the people table first:');
    console.error('      id uuid PRIMARY KEY DEFAULT gen_random_uuid()');
    console.error('      name text NOT NULL');
    console.error('      created_at timestamptz DEFAULT now()');
  } else {
    console.log(`  ✓ Seeded ${SEED_PEOPLE.length} people`);
  }

  console.log('\nDone.');
  console.log('\n⚠️  Vercel environment variables needed:');
  console.log('   VITE_SUPABASE_URL');
  console.log('   VITE_SUPABASE_ANON_KEY');
}

seed().catch(console.error);
