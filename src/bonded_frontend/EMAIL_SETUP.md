# Email Service Setup

## Environment Variables

Create a `.env` file in the root of your frontend directory with:

```
VITE_RESEND_API_KEY=re_NBLYdjMA_CwhVuAjFP5tXxYH7kRU8Cxyw
```

## Usage

### Send Test Email
```javascript
import { sendTestInvitation } from './utils/emailUtils';

const result = await sendTestInvitation();
if (result.success) {
  console.log('Email sent:', result.messageId);
}
```

### Send Invitation Email
```javascript
import { sendInvitation } from './utils/emailUtils';

const result = await sendInvitation(
  'recipient@example.com',
  'John Doe',
  'https://bonded.app/invite/abc123'
);
```

### Test Component
Import and use `EmailTestComponent` to test the email functionality:

```javascript
import EmailTestComponent from './components/email/EmailTestComponent';

// In your component
<EmailTestComponent />
```

## Files Created/Modified

1. **InvitationEmail.tsx** - Updated to use @react-email/components while preserving your existing styles
2. **lib/resend.ts** - Resend configuration
3. **services/emailService.js** - Email service functions
4. **utils/emailUtils.js** - Utility functions for easy email sending
5. **EmailTestComponent.jsx** - Test component for email functionality

## Dependencies Installed

- `@react-email/components` - React email components
- `resend` - Email sending service

Your existing styles in `_emailinvitation.module.scss` are preserved and will work with the email service.
