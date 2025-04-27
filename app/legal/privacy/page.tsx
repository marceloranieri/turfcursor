import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Turf App',
  description: 'Privacy policy for the Turf App',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-text-secondary">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account information (name, email, password)</li>
          <li>Profile information (username, avatar)</li>
          <li>User-generated content (messages, reactions)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and maintain our services</li>
          <li>Improve and personalize your experience</li>
          <li>Communicate with you about updates and changes</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@turf.app</p>
      </section>
    </article>
  );
} 