import { Metadata } from 'next';
import Link from 'next/link';
import { CURRENT_TERMS_VERSION, TERMS_VERSIONS } from '@/lib/constants/legal';

export const metadata: Metadata = {
  title: 'Terms of Service - Turf App',
  description: 'Terms of service for the Turf App',
};

export default function TermsOfServicePage(): JSX.Element {
  const currentVersion = TERMS_VERSIONS[CURRENT_TERMS_VERSION];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="bg-background-secondary rounded-lg shadow-lg p-8 space-y-8">
        <header className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <h1 className="text-4xl font-bold text-text-primary">Terms of Service</h1>
          <p className="text-text-secondary mt-2">
            Last updated: {new Date(currentVersion.publishedAt).toLocaleDateString()}
          </p>
          <p className="text-text-secondary mt-1">
            Version: {CURRENT_TERMS_VERSION}
          </p>
        </header>
        
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">1. Acceptance of Terms</h2>
          <p className="text-text-secondary">
            By accessing and using Turf, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use our service.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">2. User Conduct</h2>
          <div className="space-y-4 text-text-secondary">
            <p>Users must adhere to community guidelines and respect other users. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Treat all users with respect</li>
              <li>Not engage in harassment or hate speech</li>
              <li>Not post illegal or harmful content</li>
              <li>Not impersonate others</li>
              <li>Not attempt to circumvent our security measures</li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">3. Content Ownership</h2>
          <div className="space-y-4 text-text-secondary">
            <p>Users retain ownership of their content while granting Turf a license to use it. Specifically:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain all rights to your content</li>
              <li>You grant us a worldwide, non-exclusive license to use, store, and display your content</li>
              <li>You confirm you have the right to share any content you post</li>
              <li>We may remove content that violates these terms</li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">4. AI Usage</h2>
          <div className="space-y-4 text-text-secondary">
            <p>Turf uses artificial intelligence to enhance user experience. By using our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You acknowledge that AI may process your content</li>
              <li>AI features are provided "as is" without warranty</li>
              <li>We maintain appropriate safeguards for AI usage</li>
              <li>You can opt-out of certain AI features in settings</li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">5. Termination</h2>
          <p className="text-text-secondary">
            Turf reserves the right to terminate accounts that violate these terms. We may suspend or terminate your account:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>For violations of these terms</li>
            <li>For extended periods of inactivity</li>
            <li>To comply with legal requirements</li>
            <li>At our discretion with reasonable notice</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">6. Contact</h2>
          <p className="text-text-secondary">
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:support@turf.app" className="text-accent-primary hover:text-accent-primary-dark">
              support@turf.app
            </a>
          </p>
        </section>
        
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              href="/legal/privacy"
              className="text-accent-primary hover:text-accent-primary-dark transition-colors"
            >
              View Privacy Policy
            </Link>
            <p className="text-text-secondary text-sm">
              © {new Date().getFullYear()} Turf App. All rights reserved.
            </p>
          </div>
        </footer>
      </article>
    </div>
  );
} 