import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, we would fetch the image URL from a database based on the session ID.
  // Since we don't have a DB here, we assume the user scans the QR code that might encode the URL directly,
  // or we instruct the backend to save it in a storage bucket and fetch it here.
  
  // For the sake of this UI:
  useEffect(() => {
    // Simulate fetching image
    setTimeout(() => {
      setLoading(false);
      // Currently the QR encoded URL is just /photo/:id, which isn't enough to get the image without a DB.
      // If the URL in QR was the ImgBB url directly, they wouldn't even need this page.
      // Assuming they hit this page, we'll show a placeholder or instruction.
    }, 1000);
  }, [id]);

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
            <br/><br/>
            (Note: To display the actual image here, ensure your backend saves the ImgBB URL against the Session ID `{id}` in a database, and fetch it here).
          </p>

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
