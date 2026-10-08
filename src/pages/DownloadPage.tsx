import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';

export function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const imageUrl = searchParams.get('url');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have an image URL, we don't really need to simulate fetching, but we'll show a quick loader for UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id, imageUrl]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0806',
      color: '#f0e6cc',
      fontFamily: 'Montserrat, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#c9a227', marginBottom: '20px', fontSize: '2rem' }}>
        El Gouna Film Festival
      </h1>
      
      {loading ? (
        <div className="cine-spinner" style={{ margin: '40px auto' }} />
      ) : (
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <p style={{ marginBottom: '24px', lineHeight: 1.6 }}>
            Your cinematic masterpiece is ready! 
          </p>

          {imageUrl ? (
            <div style={{ marginBottom: '32px' }}>
              <img 
                src={imageUrl} 
                alt="Your masterpiece" 
                style={{
                  width: '100%',
                  borderRadius: '4px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  border: '2px solid rgba(201,162,39,0.3)',
                  marginBottom: '16px'
                }} 
              />
              <p style={{ fontSize: '0.9rem', color: '#c9a227', marginBottom: '16px' }}>
                Long-press the image to save it to your phone.
              </p>
            </div>
          ) : (
            <p style={{ marginBottom: '24px', lineHeight: 1.6, color: '#ff6b6b' }}>
              Oops! We couldn't find your image. Please try generating it again from the photo booth.
            </p>
          )}

          <Link to="/" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #c9a227 0%, #d4861a 100%)',
            color: '#0a0806',
            textDecoration: 'none',
            fontWeight: 700,
            borderRadius: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Back to Photo Booth
          </Link>
        </div>
      )}
    </div>
  );
}
