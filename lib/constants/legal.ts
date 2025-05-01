export const CURRENT_TERMS_VERSION = '1.0';

export const TERMS_VERSIONS = {
  '1.0': {
    publishedAt: '2024-05-01',
    summary: 'Initial terms of service',
    changes: [
      'Initial release of Terms of Service',
      'Data processing terms',
      'AI usage guidelines',
      'Content moderation policies',
      'User responsibilities',
    ],
  },
  // Add new versions here when terms are updated
  // '1.1': {
  //   publishedAt: '2024-06-01',
  //   summary: 'Updated privacy terms',
  //   changes: [
  //     'Enhanced data protection measures',
  //     'Updated third-party integrations section',
  //   ],
  // },
};

export type TermsVersion = keyof typeof TERMS_VERSIONS;

export function isValidTermsVersion(version: string): version is TermsVersion {
  return version in TERMS_VERSIONS;
}

export function getTermsVersionInfo(version: TermsVersion) {
  return TERMS_VERSIONS[version];
}

export function isLatestTermsVersion(version: string): boolean {
  return version === CURRENT_TERMS_VERSION;
} 