export type LegalDocKey = 'privacy' | 'terms' | 'cookies' | 'legal-notice' | 'accessibility';

export interface LegalDoc {
  key: LegalDocKey;
  title: string;
  lastUpdated: string;
  sections: { heading?: string; body: string }[];
}

const UPDATED = '19 May 2026';
const APP_URL = 'https://custom40k-builder.vercel.app';
const CONTACT_EMAIL = '[YOUR_CONTACT_EMAIL]';
const OWNER_NAME = '[YOUR_FULL_NAME_OR_COMPANY]';
const OWNER_NIF  = '[YOUR_NIF/CIF]';
const OWNER_ADDR = '[YOUR_ADDRESS], Spain';

export const LEGAL_DOCS: Record<LegalDocKey, LegalDoc> = {

  'legal-notice': {
    key: 'legal-notice',
    title: 'Legal Notice',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. Owner information',
        body: `In accordance with Article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), the following identification details are provided:\n\n• Full name / Company: ${OWNER_NAME}\n• Tax ID (NIF/CIF): ${OWNER_NIF}\n• Registered address: ${OWNER_ADDR}\n• Contact email: ${CONTACT_EMAIL}\n• Website: ${APP_URL}`,
      },
      {
        heading: '2. Purpose of the website',
        body: 'Custom40k Army Builder is a free, unofficial fan-made tool that allows players of Warhammer 40,000 to build and manage army rosters. It is not affiliated with, endorsed by, or officially connected to Games Workshop Group PLC in any way.',
      },
      {
        heading: '3. Intellectual property',
        body: `The source code, design, and original content of this application are the property of ${OWNER_NAME}. Warhammer 40,000, its factions, unit names, and all associated imagery are trademarks and/or copyrights of Games Workshop Group PLC. No infringement is intended. This tool is a non-commercial fan project.`,
      },
      {
        heading: '4. Liability',
        body: 'This tool is provided "as is" without any warranties of accuracy, completeness, or fitness for a particular purpose. The owner accepts no liability for decisions made based on information presented in this application.',
      },
      {
        heading: '5. Applicable law',
        body: 'This Legal Notice is governed by Spanish law. Any disputes arising from the use of this website shall be subject to the jurisdiction of the courts of Spain.',
      },
    ],
  },

  'privacy': {
    key: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. Data controller',
        body: `${OWNER_NAME}\n${OWNER_ADDR}\n${CONTACT_EMAIL}`,
      },
      {
        heading: '2. What data we collect and why',
        body: `• Bug reports: When you submit a bug report via the in-app form, your message and optionally your email address are transmitted to Formspree (a third-party form processing service). This data is used solely to investigate and fix issues.\n\n• Usage data: We do not run analytics software. Your army rosters are stored exclusively in your own browser's local storage — they never leave your device and are not accessible to us.\n\n• Server logs: Our hosting provider Vercel may automatically record standard access logs (IP address, browser type, page requested) as part of normal server operation. These are retained per Vercel's own privacy policy.`,
      },
      {
        heading: '3. Legal basis',
        body: 'Processing of bug report data is based on legitimate interest (Article 6(1)(f) GDPR): improving the quality and security of the application. No data is processed for marketing purposes.',
      },
      {
        heading: '4. Data retention',
        body: 'Bug report submissions are retained by Formspree according to their own data retention policies (typically up to 30 days on free plans). Server logs held by Vercel are subject to Vercel\'s privacy policy.',
      },
      {
        heading: '5. Third-party processors',
        body: '• Formspree Inc. — form submission processing (United States). Formspree acts as a data processor under a Data Processing Agreement. See: https://formspree.io/legal/privacy-policy\n\n• Vercel Inc. — website hosting and content delivery (United States). See: https://vercel.com/legal/privacy-policy',
      },
      {
        heading: '6. International transfers',
        body: 'Both Formspree and Vercel are US-based companies. Data transfers are conducted under the EU–US Data Privacy Framework and standard contractual clauses where applicable.',
      },
      {
        heading: '7. Your rights',
        body: `Under the GDPR and Spanish Organic Law 3/2018 (LOPD-GDD), you have the right to: access your data, rectify inaccurate data, request erasure, restrict or object to processing, and request data portability. To exercise these rights, contact us at ${CONTACT_EMAIL}.\n\nYou also have the right to lodge a complaint with the Spanish Data Protection Authority (AEPD) at www.aepd.es.`,
      },
    ],
  },

  'cookies': {
    key: 'cookies',
    title: 'Cookie Policy',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. What are cookies?',
        body: 'Cookies and similar technologies are small files that websites store in your browser to remember information between visits. This policy also covers browser localStorage and sessionStorage, which serve a similar purpose.',
      },
      {
        heading: '2. Cookies we use',
        body: `This application uses only strictly necessary functional storage. No analytics, advertising, or third-party tracking cookies are used.\n\n┌─────────────────────────────┬──────────────────┬─────────────┬──────────────────────────────────────────────┐\n│ Name                        │ Type             │ Duration    │ Purpose                                      │\n├─────────────────────────────┼──────────────────┼─────────────┼──────────────────────────────────────────────┤\n│ custom40k-army              │ localStorage     │ Persistent  │ Saves your army roster and settings locally  │\n│ custom40k-cookie-consent    │ localStorage     │ 1 year      │ Remembers that you have seen this notice     │\n│ selectedFaction             │ sessionStorage   │ Session     │ Remembers your selected faction on refresh   │\n└─────────────────────────────┴──────────────────┴─────────────┴──────────────────────────────────────────────┘`,
      },
      {
        heading: '3. Legal basis',
        body: 'All storage listed above is strictly necessary for the application to function. Under Article 22.2 of Spanish Law 34/2002 (LSSI-CE) and Recital 25 of the ePrivacy Directive, strictly necessary cookies are exempt from the consent requirement.',
      },
      {
        heading: '4. How to manage or delete cookies',
        body: 'You can clear all locally stored data at any time through your browser settings:\n\n• Chrome/Edge: Settings → Privacy and security → Clear browsing data → Cookies and site data\n• Firefox: Settings → Privacy & Security → Cookies and Site Data → Clear Data\n• Safari: Preferences → Privacy → Manage Website Data\n\nNote: clearing site data will delete your saved armies.',
      },
      {
        heading: '5. Changes to this policy',
        body: `We may update this Cookie Policy to reflect changes in the cookies we use. The "last updated" date at the top of this page will always indicate when changes were made. Questions? Contact us at ${CONTACT_EMAIL}.`,
      },
    ],
  },

  'terms': {
    key: 'terms',
    title: 'Terms of Use',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. Acceptance',
        body: 'By accessing or using Custom40k Army Builder you agree to these Terms of Use. If you do not agree, please stop using the application.',
      },
      {
        heading: '2. Description of service',
        body: 'Custom40k Army Builder is a free, browser-based tool for building and managing Warhammer 40,000 army rosters. The service is provided without charge and without any commitment to availability, uptime, or ongoing feature development.',
      },
      {
        heading: '3. Permitted use',
        body: 'You may use this tool for personal, non-commercial purposes. You may not: (a) use the app to distribute commercially, (b) reverse-engineer or copy the source code for commercial use, (c) use the app in any way that violates applicable law.',
      },
      {
        heading: '4. Intellectual property',
        body: 'Warhammer 40,000, all faction names, unit names, and related content are trademarks and copyrights of Games Workshop Group PLC. This is an unofficial fan tool with no commercial relationship with Games Workshop. All original code and UI design are the property of the app owner.',
      },
      {
        heading: '5. Data and privacy',
        body: 'Your army data is stored locally in your browser. We do not store, sell, or share your roster data. See our Privacy Policy for details on the limited data we do process (bug reports).',
      },
      {
        heading: '6. Disclaimer of warranties',
        body: 'The application is provided "as is" and "as available" without warranties of any kind. We do not warrant that the army builder accurately reflects all official rules, point costs, or codex content. Always verify against official sources.',
      },
      {
        heading: '7. Limitation of liability',
        body: `To the maximum extent permitted by applicable law, ${OWNER_NAME} shall not be liable for any indirect, incidental, or consequential damages arising from your use of this application.`,
      },
      {
        heading: '8. Changes to terms',
        body: 'We reserve the right to modify these terms at any time. Continued use of the application after changes constitutes acceptance of the new terms.',
      },
      {
        heading: '9. Governing law',
        body: 'These terms are governed by Spanish law. Any disputes shall be subject to the courts of Spain.',
      },
    ],
  },

  'accessibility': {
    key: 'accessibility',
    title: 'Accessibility Statement',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. Commitment',
        body: `${OWNER_NAME} is committed to making Custom40k Army Builder accessible to the widest possible audience, including people with disabilities.`,
      },
      {
        heading: '2. Conformance status',
        body: 'This application partially conforms to WCAG 2.1 Level AA. "Partially conforms" means that some parts of the content do not fully meet the accessibility standard.',
      },
      {
        heading: '3. Known limitations',
        body: '• Print view: the army roster print layout is generated dynamically and may not be fully compatible with screen readers.\n• Complex tables: weapon stat tables in the print view use inline styles that may not expose structure to assistive technologies.\n• Colour contrast: some decorative elements (faction colours, marks) may not meet minimum contrast ratios.\n• Keyboard navigation: modal dialogs may not fully trap focus on all browsers.',
      },
      {
        heading: '4. Feedback and contact',
        body: `We welcome feedback on the accessibility of this application. If you experience barriers or have suggestions, please contact us:\n\n• Email: ${CONTACT_EMAIL}\n\nWe aim to respond to accessibility feedback within 15 business days.`,
      },
      {
        heading: '5. Complaint procedure',
        body: 'If you are not satisfied with our response, you may contact the Spanish disability rights authority or the AEPD (Agencia Española de Protección de Datos) at www.aepd.es.',
      },
      {
        heading: '6. Assessment approach',
        body: 'This statement was prepared by self-evaluation of the application against WCAG 2.1 Level AA criteria. Last review: ' + UPDATED + '.',
      },
    ],
  },

};
