export const dynamic = 'force-dynamic';

import { fetchSitePhotos } from '@/app/construction/actions';
import PhotosClient from './client';

export default async function SitePhotosPage() {
  const result = await fetchSitePhotos();

  return (
    <PhotosClient 
      initialPhotos={result.success ? result.data || [] : []} 
      tableMissing={!!result.tableMissing} 
      tableSql={result.sql || ''}
    />
  );
}
