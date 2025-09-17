import React, { FC } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Section,
  Hr,
} from '@react-email/components';
import styles from "./scss/_emailinvitation.module.scss";

interface InvitationEmailProps {
  inviterName?: string;
  inviteLink?: string;
}

const InvitationEmail: FC<InvitationEmailProps> = ({
  inviterName = "Bonded User",
  inviteLink = "https://f3mwt-6qaaa-aaaab-qb2ba-cai.icp0.io/accept-invite?invite=invite_185f9d05906c9416_0000000000000000c",
}) => {
  return (
    <Html>
      <Head />
      <Preview>You're invited to join Bonded - Secure Relationship Verification Platform</Preview>
      <Body style={main}>
        <Container style={container}>
          <div className={styles.email}>
            {/* HEADER */}
            <div className={styles.hero}>
              <h1 className={styles.title}>
                You're Invited to <mark className={styles.hl}>Bonded</mark>
              </h1>
              <p className={styles.subtitle}>Secure Relationship Verification Platform</p>
            </div>

            {/* BODY */}
            <div className={styles.body}>
              <p className={styles.greeting}>Hello there,</p>

              <p>
                <strong>{inviterName}</strong> has invited you to join{" "}
                <mark className={styles.hl}>Bonded</mark> — a secure platform for
                building and sharing your relationship timeline together.
              </p>

              <p>
                <mark className={styles.hl}>Bonded</mark> helps couples create a
                verified timeline of their relationship journey, perfect for visa
                applications, immigration processes, or simply preserving your
                memories.
              </p>

              <a className={styles.cta} href={inviteLink}>
                Accept Invitation
              </a>

              <div className={styles.fallback}>
                <p className={styles.fallbackLabel}>Or copy this link:</p>
                <a className={styles.link} href={inviteLink}>
                  {inviteLink}
                </a>
              </div>

              <p className={styles.afterJoin}>
                Once you join, you and <strong>{inviterName}</strong> can start building your
                shared timeline with photos, messages, and important relationship milestones.
              </p>
            </div>

            {/* FOOTER */}
            <footer className={styles.footer}>
              <div className={styles.brand}>
                <mark className={styles.hlDark}>Bonded</mark>
              </div>
              <div className={styles.tagline}>
                Secure Relationship Verification Platform
              </div>
              <div className={styles.footLinks}>
                <a href="#site">bonded.app</a>
                <span>•</span>
                <a href="#privacy">Privacy Policy</a>
                <span>•</span>
                <a href="#support">Support</a>
              </div>
            </footer>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

export default InvitationEmail;

// Email-specific styles for @react-email/components
const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: 'auto',
  padding: '20px',
  maxWidth: '600px',
};
