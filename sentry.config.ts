import { withSentryConfig } from '@sentry/nextjs';

const config = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: 'turf-app',
  project: 'turf-app',
};

export default withSentryConfig(config); 