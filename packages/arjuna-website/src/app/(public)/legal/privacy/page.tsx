import { ContentContainer } from '@/app/_components/ui/layout/ContentContainer';

export const metadata = {
  title: 'ArjunaCRM - Privacy Policy',
  description: 'Privacy policy for ArjunaCRM websites and managed services.',
};

export default function PrivacyPage() {
  return (
    <ContentContainer>
      <section style={{ margin: '64px 0 56px 0', maxWidth: '860px' }}>
        <h1 style={{ color: '#141414', fontSize: '42px', margin: 0 }}>
          Privacy Policy
        </h1>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',
            lineHeight: 1.7,
            marginTop: '18px',
          }}
        >
          We collect only the data needed to operate the service, improve
          product reliability, and provide support.
        </p>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',
            lineHeight: 1.7,
          }}
        >
          For managed deployments, workspace owners control their application
          data and can request export or deletion according to agreed support
          terms.
        </p>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',
            lineHeight: 1.7,
          }}
        >
          For privacy requests, contact{' '}
          <a href="mailto:founders@vedpragya.com">founders@vedpragya.com</a>.
        </p>
      </section>
    </ContentContainer>
  );
}
