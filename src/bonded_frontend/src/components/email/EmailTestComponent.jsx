import React, { useState } from 'react';
import { sendInvitation, sendTestInvitation } from '../../utils/emailUtils';
import Button from '../../reusable/Button';

const EmailTestComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    const response = await sendTestInvitation();
    setResult(response);
    setIsLoading(false);
  };

  const handleSendInvitationEmail = async () => {
    setIsLoading(true);
    setResult(null);

    const response = await sendInvitation(
      'test@example.com',
      'John Doe',
      'https://bonded.app/invite/abc123'
    );
    setResult(response);
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Email Service Test</h2>

      <div style={{ marginBottom: '20px' }}>
        <Button
          variant="primary"
          onClick={handleSendTestEmail}
          disabled={isLoading}
          style={{ marginRight: '10px' }}
        >
          {isLoading ? 'Sending...' : 'Send Test Email'}
        </Button>

        <Button
          variant="secondary"
          onClick={handleSendInvitationEmail}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Invitation Email'}
        </Button>
      </div>

      {result && (
        <div style={{
          padding: '10px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: result.success ? '#155724' : '#721c24'
        }}>
          {result.success ? (
            <div>
              <strong>Success!</strong> Email sent with ID: {result.messageId}
            </div>
          ) : (
            <div>
              <strong>Error:</strong> {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailTestComponent;
