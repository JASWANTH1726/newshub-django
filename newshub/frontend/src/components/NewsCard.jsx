export default function NewsCard({ article }) {
  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="news-card">
      {article.urlToImage ? (
        <img src={article.urlToImage} alt="news" className="thumb" loading="lazy" />
      ) : (
        <div className="no-thumb">📰</div>
      )}
      <div className="body">
        <div className="src">📰 {article.source?.name || 'Unknown'}</div>
        <h4>{article.title}</h4>
        {article.description && <p>{article.description.slice(0, 120)}...</p>}
        <div className="foot">
          <span className="date">📅 {formatDate(article.publishedAt)}</span>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-btn">
            Read →
          </a>
        </div>
      </div>
    </div>
  );
}
