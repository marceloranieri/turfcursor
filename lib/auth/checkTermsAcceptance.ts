import { supabase } from '@/lib/supabase/client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('TermsAcceptance');

export async function checkTermsAcceptance(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('terms_accepted, terms_version')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('Error checking terms acceptance:', error);
      return false;
    }

    // Check if terms are accepted and using the latest version
    return data?.terms_accepted === true && data?.terms_version === '1.0';
  } catch (error) {
    logger.error('Error in checkTermsAcceptance:', error);
    return false;
  }
}

export async function requireTermsAcceptance(userId: string): Promise<void> {
  const hasAcceptedTerms = await checkTermsAcceptance(userId);
  
  if (!hasAcceptedTerms) {
    throw new Error('Terms of Service must be accepted to continue.');
  }
}

// Example usage in a protected route:
/*
export async function getProtectedData(userId: string) {
  // First check terms acceptance
  await requireTermsAcceptance(userId);
  
  // Then proceed with the protected operation
  // ...
}
*/ 