import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Turf App',
  description: 'Terms of service for the Turf App',
};

export default function TermsOfServicePage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-text-secondary">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p>By accessing and using Turf App, you agree to be bound by these Terms of Service.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. User Responsibilities</h2>
        <p>As a user of Turf App, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate account information</li>
          <li>Maintain the security of your account</li>
          <li>Use the service in compliance with applicable laws</li>
          <li>Respect other users and their rights</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Content Guidelines</h2>
        <p>Users are responsible for their content and must not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Post illegal or harmful content</li>
          <li>Violate intellectual property rights</li>
          <li>Harass or abuse other users</li>
          <li>Spam or promote unauthorized content</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Termination</h2>
        <p>We reserve the right to terminate or suspend accounts that violate these terms.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Contact</h2>
        <p>For questions about these Terms, please contact us at support@turf.app</p>
      </section>
      
      <div className="mt-8 pt-8 border-t border-gray-700">
        <Link
          href="/legal/privacy"
          className="text-accent-primary hover:text-accent-primary-dark transition-colors"
        >
          View Privacy Policy
        </Link>
      </div>
    </article>
  );
} 