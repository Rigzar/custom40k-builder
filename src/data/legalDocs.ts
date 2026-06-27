export type LegalDocKey = 'privacy' | 'terms' | 'cookies' | 'legal-notice' | 'accessibility';

export interface LegalDoc {
  key: LegalDocKey;
  title: string;
  lastUpdated: string;
  sections: { heading?: string; body: string }[];
}

const UPDATED       = '19 May 2026';
const APP_NAME      = 'Custom40k Army Builder';
const APP_URL       = 'https://custom40k-builder.vercel.app';
const OWNER_NAME    = 'Rigoberto Jorges';
const OWNER_NIE     = 'Y5722135W';
const OWNER_ADDR    = 'Puente Alcocer, Madrid, Spain';
const CONTACT_EMAIL = 'wh40builder@gmail.com';

export const GW_DISCLAIMER =
  'Warhammer 40,000, Space Marines, Chaos Space Marines, Tyranids, Necrons, Orks, Eldar, ' +
  'Dark Eldar, Tau Empire, Imperial Guard, Adeptus Mechanicus, Adeptus Custodes, ' +
  'Adeptus Sororitas, Grey Knights, Inquisition, Assassins, Genestealer Cults, Harlequins, ' +
  'Leagues of Votann, Chaos Daemons, and all related names, characters, factions, artwork ' +
  'and lore are trademarks and/or copyrights of Games Workshop Group PLC, registered ' +
  'worldwide. This application is an unofficial, non-commercial fan project made by fans ' +
  'for fans. It is in no way affiliated with, endorsed by, or sponsored by Games Workshop ' +
  'Group PLC. No infringement of intellectual property is intended.';

export const LEGAL_DOCS: Record<LegalDocKey, LegalDoc> = {

  'legal-notice': {
    key: 'legal-notice',
    title: 'Legal Notice (Aviso Legal)',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. Owner identification',
        body:
          `In accordance with Article 10 of Spanish Law 34/2002 on Information Society ` +
          `Services and Electronic Commerce (LSSI-CE), the following details are provided:\n\n` +
          `• Full name: ${OWNER_NAME}\n` +
          `• NIE: ${OWNER_NIE}\n` +
          `• Location: ${OWNER_ADDR}\n` +
          `• Contact email: ${CONTACT_EMAIL}\n` +
          `• Website: ${APP_URL}`,
      },
      {
        heading: '2. Purpose of this website',
        body:
          `${APP_NAME} is a free, unofficial, non-commercial fan tool that allows players ` +
          `of Warhammer 40,000 to build and manage army rosters for personal use. ` +
          `No products or services are sold through this website.`,
      },
      {
        heading: '3. Intellectual property — Games Workshop',
        body: GW_DISCLAIMER,
      },
      {
        heading: '4. Original content',
        body:
          `The source code, user interface design, and original written content of this ` +
          `application (excluding all Games Workshop intellectual property) are the ` +
          `property of ${OWNER_NAME} and are protected under applicable copyright law. ` +
          `Unauthorised reproduction for commercial purposes is prohibited.`,
      },
      {
        heading: '5. Disclaimer of liability',
        body:
          `This tool is provided "as is" for entertainment purposes only. The owner makes ` +
          `no warranty that the army builder accurately reflects all official rules, point ` +
          `costs, or codex content. Always verify rosters against official Games Workshop ` +
          `publications before use in organised play.`,
      },
      {
        heading: '6. Applicable law and jurisdiction',
        body:
          `This Legal Notice is governed by Spanish law. Any disputes arising from the ` +
          `use of this website shall be submitted to the courts of Madrid, Spain.`,
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
        body:
          `${OWNER_NAME}\n` +
          `NIE: ${OWNER_NIE}\n` +
          `${OWNER_ADDR}\n` +
          `${CONTACT_EMAIL}`,
      },
      {
        heading: '2. Data we collect and why',
        body:
          `Bug reports: When you submit a bug report using the in-app form, your message is ` +
          `posted as a public GitHub Issue on this project's repository. This data is used ` +
          `solely to investigate and fix reported issues.\n\n` +
          `Army roster data: By default, your army lists are stored exclusively in your own ` +
          `browser's local storage. They never leave your device and are not accessible to us.\n\n` +
          `Optional account: If you choose to create an account (username + password, no email ` +
          `required), we store your username, a one-way hash of your password, and your recovery ` +
          `code in two forms — a one-way hash (used to verify it) and an encrypted copy (used only ` +
          `to show it back to you in your account page) — plus any army rosters you explicitly ` +
          `save to your account, in a database operated by our hosting provider. If you set an ` +
          `optional secret question, only a one-way hash of the answer is stored, never the plain ` +
          `text. This is only used to let you load your saved rosters from any device and recover ` +
          `your account. Accounts inactive for 12 months are deleted automatically, along with ` +
          `their saved rosters.\n\n` +
          `Account recovery requests: If you use the "lost my recovery code" form, your username ` +
          `and any context you provide are posted as a public GitHub Issue on this project's ` +
          `repository so the maintainer can manually verify and restore access. Never include a ` +
          `password in this form.\n\n` +
          `Server logs: Our hosting provider Vercel automatically records standard access ` +
          `logs (IP address, browser type, page requested) as part of normal server ` +
          `operation, subject to Vercel's own privacy policy.`,
      },
      {
        heading: '3. Legal basis for processing',
        body:
          `Bug report data is processed on the basis of legitimate interest ` +
          `(Article 6(1)(f) GDPR): improving the quality and security of the application. ` +
          `No data is processed for marketing, advertising, or profiling purposes.`,
      },
      {
        heading: '4. Data retention',
        body:
          `Bug reports and account recovery requests are retained as GitHub Issues until ` +
          `manually closed/deleted. Account data (username, password hash, recovery code in ` +
          `hashed and encrypted form, optional secret question answer hash, saved rosters) is ` +
          `retained until you delete your account, or automatically after 12 months of ` +
          `inactivity. Vercel server logs are subject to Vercel's privacy policy.`,
      },
      {
        heading: '5. Third-party processors',
        body:
          `• GitHub Inc. — hosts the public issue tracker used for bug reports and account ` +
          `recovery requests, United States. Privacy policy: https://docs.github.com/site-policy/privacy-policies/github-privacy-statement\n\n` +
          `• Vercel Inc. — website hosting, content delivery, and the account database, United ` +
          `States. Privacy policy: https://vercel.com/legal/privacy-policy`,
      },
      {
        heading: '6. International data transfers',
        body:
          `Formspree and Vercel are US-based companies. Data transfers to the US are ` +
          `conducted under the EU–US Data Privacy Framework and standard contractual ` +
          `clauses (SCCs) where applicable, in compliance with GDPR Chapter V.`,
      },
      {
        heading: '7. Your rights',
        body:
          `Under the GDPR and Spanish Organic Law 3/2018 (LOPD-GDD) you have the right to:\n\n` +
          `• Access your personal data\n` +
          `• Rectify inaccurate data\n` +
          `• Request erasure ("right to be forgotten")\n` +
          `• Restrict or object to processing\n` +
          `• Request data portability\n\n` +
          `To exercise any of these rights, contact: ${CONTACT_EMAIL}\n\n` +
          `You also have the right to lodge a complaint with the Spanish Data Protection ` +
          `Authority (AEPD) at www.aepd.es if you believe your rights have been infringed.`,
      },
      {
        heading: '8. Changes to this policy',
        body:
          `This policy may be updated to reflect changes in data practices or applicable law. ` +
          `The "last updated" date at the top of this document will reflect any changes. ` +
          `Continued use of the application after an update constitutes acceptance.`,
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
        body:
          `Cookies and similar technologies (including browser localStorage and ` +
          `sessionStorage) are small pieces of data stored in your browser that allow ` +
          `a website to remember information between visits or page loads.`,
      },
      {
        heading: '2. Cookies used by this application',
        body:
          `This application uses only strictly necessary functional storage. ` +
          `No analytics, advertising, social media, or third-party tracking cookies ` +
          `are used.\n\n` +
          `Name                       | Type           | Duration  | Purpose\n` +
          `───────────────────────────┼────────────────┼───────────┼──────────────────────────────────────\n` +
          `custom40k-army             | localStorage   | Persistent| Saves your army roster and settings\n` +
          `selectedFaction            | sessionStorage | Session   | Internal navigation state (page reload always returns to the Factions screen)\n` +
          `c40k_session               | Cookie (HttpOnly)| 90 days | Keeps you logged in, only set if you create an account`,
      },
      {
        heading: '3. Legal basis — no consent required',
        body:
          `All storage listed above is strictly necessary for the application to function ` +
          `correctly. Under Article 22.2 of Spanish Law 34/2002 (LSSI-CE) and Recital 25 ` +
          `of the EU ePrivacy Directive, strictly necessary cookies and equivalent storage ` +
          `are exempt from the requirement to obtain prior consent.`,
      },
      {
        heading: '4. How to delete stored data',
        body:
          `You can clear all locally stored data at any time:\n\n` +
          `• Chrome / Edge: Settings → Privacy and security → Clear browsing data → ` +
          `"Cookies and other site data"\n` +
          `• Firefox: Settings → Privacy & Security → Cookies and Site Data → Clear Data\n` +
          `• Safari: Preferences → Privacy → Manage Website Data\n\n` +
          `Note: clearing site data will permanently delete your saved army rosters.`,
      },
      {
        heading: '5. Contact',
        body: `Questions about this Cookie Policy? Contact us at ${CONTACT_EMAIL}.`,
      },
    ],
  },

  'terms': {
    key: 'terms',
    title: 'Terms of Use',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. Acceptance of terms',
        body:
          `By accessing or using ${APP_NAME} you agree to these Terms of Use in full. ` +
          `If you do not agree with any part of these terms, please stop using the application.`,
      },
      {
        heading: '2. Description of service',
        body:
          `${APP_NAME} is a free, browser-based tool for building and managing ` +
          `Warhammer 40,000 army rosters for personal, non-commercial use. ` +
          `The service is provided at no charge and without any guarantee of availability, ` +
          `uptime, accuracy of rules data, or continued development.`,
      },
      {
        heading: '3. Fan project — Games Workshop intellectual property',
        body: GW_DISCLAIMER,
      },
      {
        heading: '4. Permitted use',
        body:
          `You may use this tool for personal, non-commercial purposes only. You may not:\n\n` +
          `(a) Use the application or its content for any commercial purpose\n` +
          `(b) Reproduce, distribute, or sell any part of the application\n` +
          `(c) Attempt to reverse-engineer or copy the source code for commercial use\n` +
          `(d) Use the application in any way that violates applicable law or the ` +
          `intellectual property rights of Games Workshop Group PLC or any other party`,
      },
      {
        heading: '5. No warranty',
        body:
          `The application is provided "as is" and "as available". We do not warrant that:\n\n` +
          `• Army point costs, unit rules, or codex data are accurate or up to date\n` +
          `• The application will be free from errors or interruptions\n` +
          `• Results from the army builder will be accepted in organised or official play\n\n` +
          `Always verify rosters against current official Games Workshop publications.`,
      },
      {
        heading: '6. Limitation of liability',
        body:
          `To the fullest extent permitted by Spanish law, ${OWNER_NAME} shall not be ` +
          `liable for any direct, indirect, incidental, or consequential damages ` +
          `arising from your use of, or inability to use, this application.`,
      },
      {
        heading: '7. Data and privacy',
        body:
          `Your army roster data is stored locally in your browser. We do not store, ` +
          `sell, or share your roster data. See our Privacy Policy for details on ` +
          `the limited personal data we process (bug report submissions only).`,
      },
      {
        heading: '8. Modifications',
        body:
          `We reserve the right to modify these terms or discontinue the service at any ` +
          `time without prior notice. Continued use of the application after changes to ` +
          `these terms constitutes acceptance of the revised terms.`,
      },
      {
        heading: '9. Governing law',
        body:
          `These Terms of Use are governed by Spanish law. Any disputes shall be ` +
          `submitted to the courts of Madrid, Spain.`,
      },
    ],
  },

  'accessibility': {
    key: 'accessibility',
    title: 'Accessibility Statement',
    lastUpdated: UPDATED,
    sections: [
      {
        heading: '1. Commitment to accessibility',
        body:
          `${OWNER_NAME} is committed to making ${APP_NAME} accessible to the widest ` +
          `possible audience, including people with disabilities, in accordance with ` +
          `Spanish Royal Decree 1112/2018 and EU Directive 2016/2102.`,
      },
      {
        heading: '2. Conformance status',
        body:
          `This application partially conforms to WCAG 2.1 Level AA. ` +
          `"Partially conforms" means that some content does not yet fully meet the ` +
          `accessibility standard.`,
      },
      {
        heading: '3. Known limitations',
        body:
          `• Print view: the dynamically generated roster layout may not be fully ` +
          `navigable by screen readers.\n` +
          `• Weapon stat tables use inline styles that may not expose table structure ` +
          `to assistive technologies.\n` +
          `• Some decorative faction colour elements may not meet minimum contrast ratios.\n` +
          `• Modal dialogs may not fully trap keyboard focus on all browsers.`,
      },
      {
        heading: '4. Feedback and contact',
        body:
          `We welcome feedback on accessibility barriers. Please contact us at:\n\n` +
          `${CONTACT_EMAIL}\n\n` +
          `We aim to respond within 15 business days.`,
      },
      {
        heading: '5. Enforcement',
        body:
          `If you are not satisfied with our response to an accessibility request, you ` +
          `may contact the Spanish disability rights authority or file a complaint with ` +
          `the AEPD (Agencia Española de Protección de Datos) at www.aepd.es.`,
      },
      {
        heading: '6. Review',
        body: `This statement was last reviewed: ${UPDATED}.`,
      },
    ],
  },

};
