import { ContentContainer } from '@/app/_components/ui/layout/ContentContainer';

export const metadata = {
  title: 'ArjunaCRM - Terms of Service',
  description: 'Terms of service for using ArjunaCRM products and services.',
};

export default function TermsPage() {
  return (
    <ContentContainer>
      <section style={{ margin: '64px 0 56px 0', maxWidth: '860px' }}>
        <h1 style={{ color: '#141414', fontSize: '42px', margin: 0 }}>
          Terms of Service
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
          By accessing ArjunaCRM services, you agree to use the platform
          lawfully and respect applicable data-protection and compliance
          requirements in your region.
        </p>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',
            lineHeight: 1.7,
          }}
        >
          You remain responsible for the data you upload, your workspace users,
          and all integrations enabled in your environment.
        </p>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',
            lineHeight: 1.7,
          }}
        >
          For commercial contracts and enterprise terms, contact us at{' '}
          <a href="mailto:founders@vedpragya.com">founders@vedpragya.com</a>.
        </p>
      </section>
    </ContentContainer>
  );
}
