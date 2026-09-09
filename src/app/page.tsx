import PhotographyExperience from '@/components/PhotographyExperience';
import photos from '@/data/photos.json';

export default function Home() {
  return <PhotographyExperience photos={photos} />;
}
