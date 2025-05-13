import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Deletion | Turf',
  description: 'Learn how to request deletion of your personal data from Turf',
};

export default function DataDeletionPage(): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="bg-background-secondary rounded-lg shadow-lg p-8 space-y-8">
        <header className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <h1 className="text-4xl font-bold text-text-primary">Data Deletion Policy</h1>
          <p className="text-text-secondary mt-2">
            Last updated: {new Date('2024-05-01').toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-6">
          <p className="text-text-secondary">
            At Turf, we respect your privacy rights and are committed to providing you control over your personal data. 
            This page explains how you can request deletion of your personal information from our systems.
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">Your Right to Data Deletion</h2>
            <p className="text-text-secondary">
              You have the right to request the deletion of your personal data that we have collected and stored. 
              This includes profile information, photographs, messaging history, location data, preferences, 
              and any other information associated with your account.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">How to Request Data Deletion</h2>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-text-primary">Option 1: Delete Your Account Through the App</h3>
              <ol className="list-decimal pl-6 space-y-2 text-text-secondary">
                <li>Sign in to your Turf account</li>
                <li>Go to Settings → Account</li>
                <li>Select "Delete Account"</li>
                <li>Follow the confirmation steps</li>
              </ol>
              <p className="text-text-secondary">This will initiate the deletion of all your personal data from our systems.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium text-text-primary">Option 2: Submit a Deletion Request</h3>
              <p className="text-text-secondary">If you cannot access your account or prefer to submit a direct request, please:</p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>Email us at <a href="mailto:team@turfyeah.com" className="text-accent-primary hover:text-accent-primary-dark">team@turfyeah.com</a> with the subject line "Data Deletion Request"</li>
                <li>Include the email address associated with your account</li>
                <li>Provide any additional information that might help us identify your account</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">Data Deletion Process</h2>
            <ol className="list-decimal pl-6 space-y-2 text-text-secondary">
              <li>We will verify your identity to ensure the security of your data</li>
              <li>We will process your deletion request within 30 days</li>
              <li>We will send confirmation once your data has been deleted</li>
            </ol>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">What We Delete</h2>
            <p className="text-text-secondary">When you request data deletion, we will delete all personal information associated with your account, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>Profile information and photographs</li>
              <li>Message history and connections</li>
              <li>Location data and preferences</li>
              <li>Usage history and activity logs</li>
              <li>All other personally identifiable information</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">Data Retention Exceptions</h2>
            <p className="text-text-secondary">In certain limited circumstances, we may be required to retain some information after your deletion request:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>To comply with legal obligations</li>
              <li>To resolve disputes</li>
              <li>To enforce our terms of service</li>
              <li>To protect against fraudulent or illegal activity</li>
            </ul>
            <p className="text-text-secondary">
              Any retained information will be kept only as long as necessary for these purposes and will be handled in accordance with our{' '}
              <Link href="/legal/privacy" className="text-accent-primary hover:text-accent-primary-dark">
                Privacy Policy
              </Link>.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">Third-Party Data</h2>
            <p className="text-text-secondary">
              When you authenticate with third-party services like Facebook, we will delete the data we have collected through those services. 
              However, this deletion does not affect the data held by those third-party services. To delete your data from Facebook or other 
              third-party services, please contact those services directly.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">Contact Us</h2>
            <p className="text-text-secondary">
              If you have any questions about data deletion or need assistance with your request, please contact us at{' '}
              <a href="mailto:team@turfyeah.com" className="text-accent-primary hover:text-accent-primary-dark">
                team@turfyeah.com
              </a>.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
} 