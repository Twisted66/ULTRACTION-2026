import type { JobRecord } from './jobs-store';

/**
 * Sample job record matching the exact JobRecord schema.
 * Represents a realistic construction job opening at ULTRACTION.
 */
export const sampleJob: JobRecord = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  slug: 'senior-project-manager',
  title: 'Senior Project Manager',
  location: 'Dubai, UAE',
  description: 'We are seeking an experienced Senior Project Manager to oversee large-scale construction projects in the UAE. The ideal candidate will have 10+ years of experience in general contracting, strong leadership skills, and a proven track record of delivering projects on time and within budget. Responsibilities include managing project teams, coordinating with clients and stakeholders, ensuring compliance with safety regulations, and maintaining quality standards throughout the project lifecycle.',
  department: 'Project Management',
  employmentType: 'Full-time',
  status: 'open',
  createdAt: '2025-01-15T08:00:00.000Z',
  updatedAt: '2025-01-15T08:00:00.000Z',
  postedAt: '2025-01-15T08:00:00.000Z',
};

/**
 * Sample job records for testing list responses.
 * Includes various construction-related positions.
 */
export const sampleJobs: JobRecord[] = [
  sampleJob,
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    slug: 'site-engineer',
    title: 'Site Engineer',
    location: 'Abu Dhabi, UAE',
    description: 'Looking for a skilled Site Engineer to join our team. The successful candidate will be responsible for supervising construction activities, ensuring technical specifications are met, coordinating with subcontractors, and maintaining daily site reports. Minimum 5 years of experience in construction projects required. Knowledge of UAE building codes and regulations is essential.',
    department: 'Engineering',
    employmentType: 'Full-time',
    status: 'open',
    createdAt: '2025-01-20T08:00:00.000Z',
    updatedAt: '2025-01-20T08:00:00.000Z',
    postedAt: '2025-01-20T08:00:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    slug: 'quantity-surveyor',
    title: 'Quantity Surveyor',
    location: 'Dubai, UAE',
    description: 'We are hiring a Quantity Surveyor to manage project costs and contracts. Responsibilities include preparing cost estimates, tender documentation, valuation of work, and financial reporting. The ideal candidate has a degree in Quantity Surveying or related field, with 3+ years of experience in the construction industry in the UAE.',
    department: 'Commercial',
    employmentType: 'Full-time',
    status: 'open',
    createdAt: '2025-02-01T08:00:00.000Z',
    updatedAt: '2025-02-01T08:00:00.000Z',
    postedAt: '2025-02-01T08:00:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    slug: 'health-safety-officer',
    title: 'Health and Safety Officer',
    location: 'Sharjah, UAE',
    description: 'Join our team as a Health and Safety Officer to ensure compliance with safety regulations on our construction sites. You will conduct safety inspections, deliver toolbox talks, investigate incidents, and maintain safety records. NEBOSH certification and minimum 3 years of construction safety experience required.',
    department: 'HSE',
    employmentType: 'Full-time',
    status: 'open',
    createdAt: '2025-02-10T08:00:00.000Z',
    updatedAt: '2025-02-10T08:00:00.000Z',
    postedAt: '2025-02-10T08:00:00.000Z',
  },
];

/**
 * Returns a single sample job record.
 * Useful for testing single job responses.
 */
export function getSampleJob(): JobRecord {
  return { ...sampleJob };
}

/**
 * Returns an array of sample job records.
 * Useful for testing list jobs responses.
 */
export function getSampleJobs(): JobRecord[] {
  return sampleJobs.map(job => ({ ...job }));
}

/**
 * Returns a sample job response in the exact format returned by the production API.
 * Matches the response format of POST /api/jobs (success) and GET /api/jobs?id=X.
 */
export function getSampleJobResponse(): { ok: true; data: { job: JobRecord } } {
  return {
    ok: true,
    data: {
      job: getSampleJob(),
    },
  };
}

/**
 * Returns a sample job list response in the exact format returned by the production API.
 * Matches the response format of GET /api/jobs (success).
 */
export function getSampleListResponse(): { ok: true; data: { jobs: JobRecord[] } } {
  return {
    ok: true,
    data: {
      jobs: getSampleJobs(),
    },
  };
}

/**
 * Generates a test job with the [TEST] tag in the department.
 * This makes test jobs easily identifiable and filterable.
 *
 * @param override - Optional overrides for the test job
 * @returns A job record suitable for testing
 */
export function generateTestJob(override?: Partial<JobRecord>): JobRecord {
  const now = new Date().toISOString();
  return {
    id: `test-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    slug: `test-job-${Date.now()}`,
    title: override?.title ?? 'Test Position',
    location: override?.location ?? 'Dubai, UAE',
    description: override?.description ?? 'This is a test job created via the GPT test endpoint. It can be safely deleted.',
    department: override?.department ?? '[TEST] Department',
    employmentType: override?.employmentType ?? 'Full-time',
    status: 'open',
    createdAt: now,
    updatedAt: now,
    postedAt: override?.postedAt ?? now,
    ...override,
  };
}
