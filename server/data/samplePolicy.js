/**
 * Sample policy data — fixed fictional policy for trust scoring demo.
 * This is NEVER a real policy. Clearly labeled as fictional.
 */

export const SAMPLE_POLICY_TEXT = `
SURAKSHA SHIELD HEALTH INSURANCE POLICY
Policy Number: DEMO-2024-FICTIONAL
(This is a fictional demo policy for demonstration purposes only)

SECTION 1: COVERAGE
This policy covers the insured for hospitalization expenses arising from illness or accidental injury, subject to the terms, conditions, and exclusions stated herein.

Sum Insured: ₹5,00,000 per annum
Room Rent Limit: Up to ₹5,000/day or 1% of sum insured, whichever is lower

SECTION 2: PREMIUM AND CHARGES
Annual Premium: ₹12,000 (exclusive of applicable taxes)
Processing Fee: A processing fee of up to 8% of the annual premium may be charged at the discretion of the company at the time of renewal.
Late Payment Surcharge: 2% per month on overdue premiums.

SECTION 3: CLAIM PROCESS
3.1 Intimation: All claims must be intimated to the company within 15 calendar days of the date of admission to the hospital. Late intimation may result in claims being settled at the sole discretion of the claims committee.
3.2 Documentation: The insured must provide original bills, discharge summary, investigation reports, and any other documents as may be requested by the company.
3.3 Settlement: Claims will be processed within 30 business days of receiving complete documentation.

SECTION 4: EXCLUSIONS
This policy does not cover:
a) Pre-existing conditions for the first 48 months of continuous coverage
b) Treatment that is non-essential or elective in nature, as determined by the company's medical team
c) Self-inflicted injuries or injuries arising from participation in hazardous activities
d) Cosmetic or aesthetic treatments unless necessitated by an accident
e) Dental treatment unless requiring hospitalization
f) Expenses related to spectacles, contact lenses, or hearing aids

SECTION 5: RENEWAL
This policy is renewable annually. The company reserves the right to revise the premium, terms, and conditions at the time of renewal. Renewal premiums must be paid within 15 days of the renewal date to avoid a break in coverage.

SECTION 6: GENERAL CONDITIONS
6.1 The company may cancel this policy with 15 days written notice.
6.2 Any dispute arising under this policy shall be referred to an arbitrator appointed by the company.
6.3 This policy is governed by the laws of India and subject to the jurisdiction of courts in Mumbai.
`;

/**
 * Fallback trust score result — used when the AI scoring fails.
 * Provides a reasonable default so the screen never renders empty.
 */
export const FALLBACK_SCORE_RESULT = {
  score: 62,
  flags: [
    {
      issue: 'Discretionary processing fee',
      explanation: "Up to 8% renewal fee is set at the company's discretion rather than a fixed, disclosed rate.",
      deduction: 18,
    },
    {
      issue: 'Short claim intimation window',
      explanation: "Claims must be reported within 15 days, and late claims are settled at the committee's discretion.",
      deduction: 14,
    },
    {
      issue: 'Vague exclusion language',
      explanation: '"Non-essential or elective" treatment is not clearly defined, leaving broad discretion to the insurer.',
      deduction: 6,
    },
  ],
};
