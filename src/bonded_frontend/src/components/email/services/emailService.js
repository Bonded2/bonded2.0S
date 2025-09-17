import { resend } from '../lib/resend';
import InvitationEmail from '../InvitationEmail';

export const sendInvitationEmail = async (to, inviterName, inviteLink) => {
  try {
    const data = await resend.emails.send({
      from: 'Bonded <onboarding@bonded.app>',
      to: [to],
      subject: `You're invited to join Bonded`,
      react: InvitationEmail({
        inviterName: inviterName || 'Bonded User',
        inviteLink: inviteLink
      }),
    });

    return { success: true, data: data.id };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { success: false, error: error.message };
  }
};

export const sendTestEmail = async () => {
  try {
    const data = await resend.emails.send({
      from: 'Bonded <onboarding@bonded.app>',
      to: ['delivered@resend.dev'],
      subject: 'Test Email from Bonded',
      react: InvitationEmail({
        inviterName: 'Test User',
        inviteLink: 'https://bonded.app/test-invite'
      }),
    });

    return { success: true, data: data.id };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
};
