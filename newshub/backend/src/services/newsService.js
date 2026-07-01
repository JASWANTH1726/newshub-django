const fetch = require('node-fetch');
const Parser = require('rss-parser');
const rssParser = new Parser({ timeout: 8000 });

const AREA_QUERY_MAP = {
  // Andhra Pradesh
  vizag: 'Visakhapatnam', vijayawada: 'Vijayawada', guntur: 'Guntur',
  tirupati: 'Tirupati', kurnool: 'Kurnool', nellore: 'Nellore',
  rajahmundry: 'Rajahmundry', kakinada: 'Kakinada', eluru: 'Eluru',
  ongole: 'Ongole', kadapa: 'Kadapa', anantapur: 'Anantapur',
  srikakulam: 'Srikakulam', vizianagaram: 'Vizianagaram',
  // Telangana
  hyderabad: 'Hyderabad', hyderabad_hitech: 'HiTech City Hyderabad',
  hyderabad_secunderabad: 'Secunderabad Hyderabad',
  warangal: 'Warangal', karimnagar: 'Karimnagar', nizamabad: 'Nizamabad',
  khammam: 'Khammam', nalgonda: 'Nalgonda', adilabad: 'Adilabad',
  // Tamil Nadu
  chennai: 'Chennai', coimbatore: 'Coimbatore', madurai: 'Madurai',
  salem: 'Salem', trichy: 'Trichy', tirunelveli: 'Tirunelveli',
  vellore: 'Vellore', erode: 'Erode',
  // Karnataka
  bangalore: 'Bangalore', mysore: 'Mysore', mangalore: 'Mangalore',
  hubli: 'Hubli Dharwad', belgaum: 'Belagavi',
  // Kerala
  kochi: 'Kochi', thiruvananthapuram: 'Thiruvananthapuram',
  kozhikode: 'Kozhikode', thrissur: 'Thrissur', kollam: 'Kollam',
  // Maharashtra
  mumbai: 'Mumbai', pune: 'Pune', nagpur: 'Nagpur',
  nashik: 'Nashik', aurangabad: 'Aurangabad', solapur: 'Solapur',
  // Delhi/NCR
  delhi: 'New Delhi', noida: 'Noida', gurgaon: 'Gurgaon', faridabad: 'Faridabad',
  // West Bengal
  kolkata: 'Kolkata', siliguri: 'Siliguri',
  // Gujarat
  ahmedabad: 'Ahmedabad', surat: 'Surat', vadodara: 'Vadodara', rajkot: 'Rajkot',
  // Rajasthan
  jaipur: 'Jaipur', jodhpur: 'Jodhpur', udaipur: 'Udaipur', kota: 'Kota',
  // Punjab/Haryana
  chandigarh: 'Chandigarh', amritsar: 'Amritsar', ludhiana: 'Ludhiana',
  // Uttar Pradesh
  lucknow: 'Lucknow', kanpur: 'Kanpur', varanasi: 'Varanasi',
  agra: 'Agra', meerut: 'Meerut',
  // Bihar
  patna: 'Patna',
  // MP
  bhopal: 'Bhopal', indore: 'Indore',
  // National/International
  national: 'India', international: 'World',
};

// RSS feeds for newspapers
const NEWSPAPER_RSS = {
  // English - National
  times_of_india:   'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  the_hindu:        'https://www.thehindu.com/news/feeder/default.rss',
  indian_express:   'https://indianexpress.com/feed/',
  hindustan_times:  'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
  deccan_herald:    'https://www.deccanherald.com/rss-feed/national.rss',
  economic_times:   'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
  business_standard:'https://www.business-standard.com/rss/home_page_top_stories.rss',
  // English - International
  bbc:              'https://feeds.bbci.co.uk/news/world/rss.xml',
  reuters:          'https://feeds.reuters.com/reuters/topNews',
  guardian:         'https://www.theguardian.com/world/rss',
  al_jazeera:       'https://www.aljazeera.com/xml/rss/all.xml',
  cnn:              'http://rss.cnn.com/rss/edition.rss',
  // Telugu
  eenadu:           'https://www.eenadu.net/rss/telugu-news.xml',
  sakshi:           'https://www.sakshi.com/rss/telugu-news.xml',
  andhrajyothy:     'https://www.andhrajyothy.com/rss/top-news.xml',
  namaste_telangana:'https://www.namasttelangana.com/rss/top-news.xml',
  telangana_today:  'https://telanganatoday.com/feed',
  vaartha:          'https://www.vaartha.com/feed',
  great_andhra:     'https://www.greatandhra.com/rss/news.xml',
  // Hindi
  dainik_jagran:    'https://www.jagran.com/rss/news-national.xml',
  dainik_bhaskar:   'https://www.bhaskar.com/rss-feed/8491/',
  amar_ujala:       'https://www.amarujala.com/rss/breaking-news.xml',
  navbharat_times:  'https://navbharattimes.indiatimes.com/rssfeedstopstories.cms',
  hindustan_hindi:  'https://www.livehindustan.com/rss/national.xml',
  rajasthan_patrika:'https://www.patrika.com/rss/national-news.xml',
  jansatta:         'https://www.jansatta.com/feed/',
  // Tamil
  daily_thanthi:    'https://www.dailythanthi.com/rss/home',
  dinamalar:        'https://www.dinamalar.com/rss/news.xml',
  dinamani:         'https://www.dinamani.com/rss/all-news.xml',
  maalai_malar:     'https://www.maalaimalar.com/rss/news.xml',
  // Kannada
  vijaya_karnataka: 'https://vijaykarnataka.com/rssfeedstopstories.cms',
  prajavani:        'https://www.prajavani.net/feed',
  vijayavani:       'https://www.vijayavani.net/feed',
  udayavani:        'https://www.udayavani.com/feed',
  // Malayalam
  malayala_manorama:'https://www.manoramaonline.com/rss/news.xml',
  mathrubhumi:      'https://www.mathrubhumi.com/rss/news.xml',
  deshabhimani:     'https://www.deshabhimani.com/rss',
  kerala_kaumudi:   'https://www.keralakaumudi.com/rss/news.xml',
  // Marathi
  lokmat:           'https://www.lokmat.com/rss.xml',
  maharashtra_times:'https://maharashtratimes.com/rssfeedstopstories.cms',
  sakal:            'https://www.sakal.com/rss/top-news.xml',
  pudhari:          'https://epaper.pudhari.news/feed',
  // Bengali
  anandabazar:      'https://www.anandabazar.com/rss/latest-news.xml',
  bartaman:         'https://www.bartamanpatrika.com/rss',
  sangbad_pratidin: 'https://www.sangbadpratidin.in/feed',
  telegraph_india:  'https://www.telegraphindia.com/feeds/rss/india.xml',
  // Gujarati
  gujarat_samachar: 'https://www.gujaratsamachar.com/rss',
  divya_bhaskar:    'https://www.divyabhaskar.co.in/rss-feed/8491/',
  sandesh:          'https://www.sandesh.com/rss/news.xml',
};

const NEWSPAPER_NAME_MAP = {
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'The Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', bbc: 'BBC News', reuters: 'Reuters',
  guardian: 'The Guardian', al_jazeera: 'Al Jazeera', cnn: 'CNN',
  economic_times: 'Economic Times', business_standard: 'Business Standard',
  eenadu: 'Eenadu', sakshi: 'Sakshi', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today',
  vaartha: 'Vaartha', great_andhra: 'Great Andhra',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan Hindi',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta',
  daily_thanthi: 'Dina Thanthi', dinamalar: 'Dinamalar',
  dinamani: 'Dinamani', maalai_malar: 'Maalai Malar',
  vijaya_karnataka: 'Vijaya Karnataka', prajavani: 'Prajavani',
  vijayavani: 'Vijayavani', udayavani: 'Udayavani',
  malayala_manorama: 'Malayala Manorama', mathrubhumi: 'Mathrubhumi',
  deshabhimani: 'Deshabhimani',
  lokmat: 'Lokmat', maharashtra_times: 'Maharashtra Times',
  pudhari: 'Pudhari', sakal: 'Sakal',
  anandabazar: 'Anandabazar Patrika', bartaman: 'Bartaman Patrika',
  sangbad_pratidin: 'Sangbad Pratidin', telegraph_india: 'The Telegraph India',
  gujarat_samachar: 'Gujarat Samachar', divya_bhaskar: 'Divya Bhaskar',
  sandesh: 'Sandesh',
};

// Google News RSS — always works, language+topic aware
function googleNewsRSS(query, lang) {
  const hl = lang || 'en';
  const gl = 'IN';
  const encoded = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${encoded}&hl=${hl}-IN&gl=${gl}&ceid=${gl}:${hl}`;
}

// Language code map for Google News
const GOOGLE_LANG = {
  en: 'en', hi: 'hi', te: 'te', ta: 'ta',
  kn: 'kn', ml: 'ml', mr: 'mr', bn: 'bn', gu: 'gu',
};

// Newspaper to Google News search query map
const NEWSPAPER_GOOGLE_QUERY = {
  eenadu: 'Eenadu', sakshi: 'Sakshi Telugu', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today',
  vaartha: 'Vaartha Telugu', great_andhra: 'Great Andhra',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan Hindi',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta',
  daily_thanthi: 'Dina Thanthi', dinamalar: 'Dinamalar',
  dinamani: 'Dinamani', maalai_malar: 'Maalai Malar',
  vijaya_karnataka: 'Vijaya Karnataka', prajavani: 'Prajavani',
  vijayavani: 'Vijayavani', udayavani: 'Udayavani',
  malayala_manorama: 'Malayala Manorama', mathrubhumi: 'Mathrubhumi',
  deshabhimani: 'Deshabhimani', kerala_kaumudi: 'Kerala Kaumudi',
  lokmat: 'Lokmat', maharashtra_times: 'Maharashtra Times',
  sakal: 'Sakal', pudhari: 'Pudhari',
  anandabazar: 'Anandabazar Patrika', bartaman: 'Bartaman Patrika',
  sangbad_pratidin: 'Sangbad Pratidin', telegraph_india: 'Telegraph India',
  gujarat_samachar: 'Gujarat Samachar', divya_bhaskar: 'Divya Bhaskar',
  sandesh: 'Sandesh',
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', economic_times: 'Economic Times',
  business_standard: 'Business Standard', bbc: 'BBC News',
  reuters: 'Reuters', guardian: 'The Guardian',
  al_jazeera: 'Al Jazeera', cnn: 'CNN',
};

async function fetchFromGoogleNews(newspaper, area, language) {
  const paperQuery = NEWSPAPER_GOOGLE_QUERY[newspaper];
  if (!paperQuery) return [];
  const areaName = area && area !== 'national' && area !== 'international' && AREA_QUERY_MAP[area]
    ? ` ${AREA_QUERY_MAP[area]}` : '';
  const lang = GOOGLE_LANG[language] || 'en';
  const url = googleNewsRSS(`${paperQuery}${areaName}`, lang);
  try {
    const feed = await rssParser.parseURL(url);
    return feed.items.slice(0, 20).map(item => ({
      title: item.title?.replace(/ - [^-]+$/, '') || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || paperQuery },
    }));
  } catch {
    return [];
  }
}

async function fetchFromNewsAPI({ query, language = 'en', fromDate } = {}) {
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: process.env.NEWS_API_KEY,
    });

    // NewsAPI only supports en, ar, de, es, fr, he, it, nl, no, pt, ru, sv, ud, zh
    // For Indian languages fall back to English search with area/keyword
    const supportedLangs = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'zh'];
    if (supportedLangs.includes(language)) params.set('language', language);

    if (fromDate) params.set('from', fromDate);

    const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).filter(a => a.title && a.title !== '[Removed]');
  } catch {
    return [];
  }
}

async function fetchFromRSS(newspaper, area) {
  const url = NEWSPAPER_RSS[newspaper];
  if (!url) return [];
  try {
    const feed = await rssParser.parseURL(url);
    let items = feed.items.slice(0, 50).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: item.enclosure?.url || item['media:content']?.['$']?.url || null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || newspaper },
    }));

    // If a specific area is selected (not national/international), filter by area name
    const areaName = area && AREA_QUERY_MAP[area];
    if (areaName && area !== 'national' && area !== 'international') {
      const areaLower = areaName.toLowerCase();
      const filtered = items.filter(a =>
        a.title.toLowerCase().includes(areaLower) ||
        a.description.toLowerCase().includes(areaLower)
      );
      // If area-filtered results exist use them, otherwise return all (area may not appear in titles)
      if (filtered.length > 0) items = filtered;
    }

    return items.slice(0, 20);
  } catch {
    return [];
  }
}

async function fetchByNewspaper(newspaper, area, language, fromDate) {
  // 1. Try direct RSS feed first
  const rssArticles = await fetchFromRSS(newspaper, area);
  if (rssArticles.length > 0) return rssArticles;

  // 2. Google News RSS — works for all languages including Telugu, Hindi, Tamil etc.
  const googleArticles = await fetchFromGoogleNews(newspaper, area, language);
  if (googleArticles.length > 0) return googleArticles;

  // 3. Last resort: NewsAPI area search so page is never blank
  return fetchByAreaAndLanguage(area, language, [], fromDate);
}

async function fetchByAreaAndLanguage(area, language, keywords, fromDate) {
  const areaName = AREA_QUERY_MAP[area] || 'India';
  let query;
  if (keywords && keywords.length > 0) {
    query = `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`;
  } else {
    query = areaName;
  }

  // For Indian languages not supported by NewsAPI, use Google News RSS
  const newsApiLangs = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'zh'];
  if (!newsApiLangs.includes(language)) {
    const lang = GOOGLE_LANG[language] || 'en';
    const url = googleNewsRSS(query, lang);
    try {
      const feed = await rssParser.parseURL(url);
      const items = feed.items.slice(0, 20).map(item => ({
        title: item.title?.replace(/ - [^-]+$/, '') || '',
        description: item.contentSnippet || item.summary || '',
        url: item.link || '',
        urlToImage: null,
        publishedAt: item.pubDate || item.isoDate || '',
        source: { name: item.source?.title || 'Google News' },
      }));
      if (items.length > 0) return items;
    } catch { /* fall through to NewsAPI */ }
  }

  return fetchFromNewsAPI({ query, language, fromDate });
}

async function fetchRecommendations(keywords, area, language) {
  if (!keywords || keywords.length === 0) return [];
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`;

  const newsApiLangs = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'zh'];
  if (!newsApiLangs.includes(language)) {
    const lang = GOOGLE_LANG[language] || 'en';
    const url = googleNewsRSS(query, lang);
    try {
      const feed = await rssParser.parseURL(url);
      return feed.items.slice(0, 20).map(item => ({
        title: item.title?.replace(/ - [^-]+$/, '') || '',
        description: item.contentSnippet || '',
        url: item.link || '',
        urlToImage: null,
        publishedAt: item.pubDate || item.isoDate || '',
        source: { name: item.source?.title || 'Google News' },
      }));
    } catch { /* fall through */ }
  }

  return fetchFromNewsAPI({ query, language });
}

module.exports = {
  fetchFromNewsAPI,
  fetchFromRSS,
  fetchByNewspaper,
  fetchByAreaAndLanguage,
  fetchRecommendations,
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
};
