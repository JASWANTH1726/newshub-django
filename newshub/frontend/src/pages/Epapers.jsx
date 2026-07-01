import Navbar from '../components/Navbar';
import styles from './Epapers.module.css';

const EPAPERS = {
  English: [
    { name: 'Times of India', url: 'https://epaper.timesgroup.com/', logo: '🗞️' },
    { name: 'The Hindu', url: 'https://epaper.thehindu.com/', logo: '🗞️' },
    { name: 'Indian Express', url: 'https://epaper.indianexpress.com/', logo: '🗞️' },
    { name: 'Hindustan Times', url: 'https://epaper.hindustantimes.com/', logo: '🗞️' },
    { name: 'Deccan Herald', url: 'https://epaper.deccanherald.com/', logo: '🗞️' },
    { name: 'Deccan Chronicle', url: 'https://epaper.deccanchronicle.com/', logo: '🗞️' },
    { name: 'Economic Times', url: 'https://epaper.economictimes.com/', logo: '📊' },
    { name: 'Business Standard', url: 'https://epaper.business-standard.com/', logo: '📊' },
    { name: 'Financial Express', url: 'https://epaper.financialexpress.com/', logo: '📊' },
    { name: 'The Tribune', url: 'https://epaper.tribuneindia.com/', logo: '🗞️' },
    { name: 'The Hans India', url: 'https://epaper.thehansindia.com/', logo: '🗞️' },
  ],
  Telugu: [
    { name: 'Eenadu', url: 'https://epaper.eenadu.net/', logo: '📰' },
    { name: 'Sakshi', url: 'https://epaper.sakshi.com/', logo: '📰' },
    { name: 'Andhra Jyothy', url: 'https://epaper.andhrajyothy.com/', logo: '📰' },
    { name: 'Namasthe Telangana', url: 'https://epaper.namaste telangana.com/', logo: '📰' },
    { name: 'Vaartha', url: 'https://epaper.vaartha.com/', logo: '📰' },
    { name: 'Andhra Bhoomi', url: 'https://epaper.andhrabhoomi.net/', logo: '📰' },
  ],
  Hindi: [
    { name: 'Dainik Jagran', url: 'https://epaper.jagran.com/', logo: '📰' },
    { name: 'Dainik Bhaskar', url: 'https://epaper.bhaskar.com/', logo: '📰' },
    { name: 'Amar Ujala', url: 'https://epaper.amarujala.com/', logo: '📰' },
    { name: 'Hindustan (Hindi)', url: 'https://epaper.livehindustan.com/', logo: '📰' },
    { name: 'Navbharat Times', url: 'https://epaper.navbharattimes.com/', logo: '📰' },
    { name: 'Rajasthan Patrika', url: 'https://epaper.patrika.com/', logo: '📰' },
  ],
  Tamil: [
    { name: 'Dina Thanthi', url: 'https://epaper.dinathanthi.com/', logo: '📰' },
    { name: 'Dinamalar', url: 'https://epaper.dinamalar.com/', logo: '📰' },
    { name: 'Dinamani', url: 'https://epaper.dinamani.com/', logo: '📰' },
    { name: 'Daily Thanthi', url: 'https://epaper.dailythanthi.com/', logo: '📰' },
  ],
  Kannada: [
    { name: 'Vijaya Karnataka', url: 'https://epaper.vijaykarnataka.com/', logo: '📰' },
    { name: 'Prajavani', url: 'https://epaper.prajavani.net/', logo: '📰' },
    { name: 'Vijayavani', url: 'https://epaper.vijayavani.net/', logo: '📰' },
    { name: 'Udayavani', url: 'https://epaper.udayavani.com/', logo: '📰' },
  ],
  Malayalam: [
    { name: 'Malayala Manorama', url: 'https://epaper.manoramaonline.com/', logo: '📰' },
    { name: 'Mathrubhumi', url: 'https://epaper.mathrubhumi.com/', logo: '📰' },
    { name: 'Deshabhimani', url: 'https://epaper.deshabhimani.com/', logo: '📰' },
    { name: 'Kerala Kaumudi', url: 'https://epaper.keralakaumudi.com/', logo: '📰' },
  ],
  Marathi: [
    { name: 'Lokmat', url: 'https://epaper.lokmat.com/', logo: '📰' },
    { name: 'Maharashtra Times', url: 'https://epaper.maharashtratimes.com/', logo: '📰' },
    { name: 'Sakal', url: 'https://epaper.sakal.com/', logo: '📰' },
    { name: 'Pudhari', url: 'https://epaper.pudhari.news/', logo: '📰' },
  ],
  Bengali: [
    { name: 'Anandabazar Patrika', url: 'https://epaper.anandabazar.com/', logo: '📰' },
    { name: 'Bartaman Patrika', url: 'https://epaper.bartamanpatrika.com/', logo: '📰' },
    { name: 'Sangbad Pratidin', url: 'https://epaper.sangbadpratidin.in/', logo: '📰' },
  ],
  Gujarati: [
    { name: 'Gujarat Samachar', url: 'https://epaper.gujaratsamachar.com/', logo: '📰' },
    { name: 'Divya Bhaskar', url: 'https://epaper.divyabhaskar.co.in/', logo: '📰' },
    { name: 'Sandesh', url: 'https://epaper.sandesh.com/', logo: '📰' },
  ],
};

const LANG_FLAGS = {
  English: '🇬🇧', Telugu: '🔵', Hindi: '🇮🇳', Tamil: '🟠',
  Kannada: '🟡', Malayalam: '🟢', Marathi: '🟣', Bengali: '🔴', Gujarati: '🟤',
};

export default function Epapers() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>📄 E-Papers</h1>
          <p>Read today's newspaper editions online — click any paper to open its e-paper portal</p>
        </div>

        {Object.entries(EPAPERS).map(([lang, papers]) => (
          <section key={lang} className={styles.section}>
            <h2 className={styles.langTitle}>
              <span>{LANG_FLAGS[lang]}</span> {lang}
            </h2>
            <div className={styles.grid}>
              {papers.map(paper => (
                <a
                  key={paper.name}
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  <div className={styles.cardLogo}>{paper.logo}</div>
                  <div className={styles.cardName}>{paper.name}</div>
                  <div className={styles.cardAction}>Read E-Paper →</div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
