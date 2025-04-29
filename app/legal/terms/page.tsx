import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Turf App',
  description: 'Terms of service for the Turf App',
};

export default function TermsOfServicePage(): JSX.Element {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-text-secondary">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p>By accessing and using Turf, you agree to be bound by these Terms of Service.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. User Conduct</h2>
        <p>Users must adhere to community guidelines and respect other users.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Content Ownership</h2>
        <p>Users retain ownership of their content while granting Turf a license to use it.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Termination</h2>
        <p>Turf reserves the right to terminate accounts that violate these terms.</p>
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