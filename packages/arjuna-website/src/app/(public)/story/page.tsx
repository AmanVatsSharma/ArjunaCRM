import { ContentContainer } from '@/app/_components/ui/layout/ContentContainer';

export const metadata = {
  title: 'ArjunaCRM - Story',
  description:
    'Why we built ArjunaCRM: open source CRM software that puts teams in control of their data and product direction.',
};

export default function StoryPage() {
  return (
    <ContentContainer>
      <section style={{ marginTop: '64px', maxWidth: '860px' }}>
        <h1 style={{ color: '#141414', fontSize: '48px', margin: 0 }}>
          The story behind ArjunaCRM
        </h1>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '18px',
            lineHeight: 1.7,
            marginTop: '20px',
          }}
        >
          We started ArjunaCRM because modern teams needed a CRM that was fast,
          customizable, and not locked behind expensive contracts. We believe
          customer data should stay under your control.
        </p>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '18px',
            lineHeight: 1.7,
          }}
        >
          ArjunaCRM is built on open standards and an extensible architecture.
          You can model your workflows, automate repetitive work, and keep
          moving without waiting on vendor roadmaps.
        </p>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '18px',
            lineHeight: 1.7,
          }}
        >
          If you are building a revenue team that values ownership,
          transparency, and speed, we would love to build with you.
        </p>
      </section>
    </ContentContainer>
  );
}
