import { supabase } from './supabase';
import type { SiteContentKey } from './types';
import { FALLBACK_CONTENT, getFallbackContent } from './fallback-data';

export { FALLBACK_CONTENT, getFallbackContent };

export async function getContent(key: SiteContentKey): Promise<Record<string, unknown>> {
  try {
    const { data } = await supabase
      .from('site_content')
      .select('content')
      .eq('content_key', key)
      .maybeSingle();

    return data?.content ?? FALLBACK_CONTENT[key];
  } catch (err) {
    return FALLBACK_CONTENT[key];
  }
}

