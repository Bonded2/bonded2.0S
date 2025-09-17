import { sendInvitationEmail, sendTestEmail } from '../components/email/services/emailService';

// Utility function to send invitation emails
export const sendInvitation = async (recipientEmail, inviterName, inviteLink) => {
  try {
    const result = await sendInvitationEmail(recipientEmail, inviterName, inviteLink);
    
    if (result.success) {
      console.log('Invitation email sent successfully:', result.data);
      return { success: true, messageId: result.data };
    } else {
      console.error('Failed to send invitation email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in sendInvitation utility:', error);
    return { success: false, error: error.message };
  }
};

// Utility function to send test emails
export const sendTestInvitation = async () => {
  try {
    const result = await sendTestEmail();
    
    if (result.success) {
      console.log('Test email sent successfully:', result.data);
      return { success: true, messageId: result.data };
    } else {
      console.error('Failed to send test email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in sendTestInvitation utility:', error);
    return { success: false, error: error.message };
  }
};
