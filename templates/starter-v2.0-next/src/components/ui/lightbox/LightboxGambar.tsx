import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export interface LightboxGambarProps {
  gambar: string[];
  indeks: number;
  onTutup: () => void;
  alt?: string;
}

export default function LightboxGambar({ gambar, indeks, onTutup, alt }: LightboxGambarProps) {
  return (
    <Lightbox
      open={indeks >= 0}
      index={Math.max(0, indeks)}
      close={onTutup}
      slides={gambar.map((url) => ({ src: url, alt }))}
      plugins={[Counter, Thumbnails, Zoom]}
      counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
      carousel={{ finite: gambar.length <= 1 }}
    />
  );
}
