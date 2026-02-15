import { ContentContainer } from '../_components/ui/layout/ContentContainer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'ArjunaCRM - Open Source CRM for Revenue Teams',
  description:
    'ArjunaCRM is the open source CRM for modern revenue teams. Customize objects, automate workflows, and onboard your team in minutes.',
};

export default function Home() {
  return (
    <ContentContainer>
      <section style={{ marginTop: '64px', maxWidth: '900px' }}>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          Open Source CRM • Self-hosted or managed
        </p>
        <h1
          style={{
            color: '#141414',
            fontSize: '56px',
            lineHeight: 1.1,
            margin: '0 0 20px 0',
            maxWidth: '780px',
          }}
        >
          Own your CRM stack. Move faster with ArjunaCRM.
        </h1>
        <p
          style={{
            color: '#474747',
            fontFamily: 'var(--font-inter)',
            fontSize: '20px',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '760px',
          }}
        >
          ArjunaCRM helps teams manage pipeline, accounts, contacts, and
          workflows in one customizable workspace. Launch quickly, keep control
          of your data, and scale with your own product strategy.
        </p>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '32px',
          }}
        >
          <a
            href="https://app.vedpragya.com"
            style={{
              backgroundColor: '#141414',
              borderRadius: '8px',
              color: 'white',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 18px',
              textDecoration: 'none',
            }}
          >
            Start Free
          </a>
          <a
            href="/pricing"
            style={{
              border: '1px solid #d4d4d4',
              borderRadius: '8px',
              color: '#141414',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 18px',
              textDecoration: 'none',
            }}
          >
            See Pricing
          </a>
          <a
            href="/releases"
            style={{
              color: '#525252',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            Product updates
          </a>
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          marginTop: '56px',
          width: '100%',
        }}
      >
        {[
          {
            description:
              'Model your process with custom objects, fields, and views that match your sales motion.',
            title: 'Flexible data model',
          },
          {
            description:
              'Use workflows, triggers, and actions to keep data fresh and remove repetitive tasks.',
            title: 'Workflow automation',
          },
          {
            description:
              'Track roles, access, and activity while keeping your customer data under your control.',
            title: 'Built for security',
          },
        ].map((item) => (
          <article
            key={item.title}
            style={{
              background: '#fafafa',
              border: '1px solid #ebebeb',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h2
              style={{
                color: '#141414',
                fontSize: '24px',
                margin: '0 0 8px 0',
              }}
            >
              {item.title}
            </h2>
            <p
              style={{
                color: '#525252',
                fontFamily: 'var(--font-inter)',
                fontSize: '15px',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section
        style={{
          borderTop: '1px solid #ebebeb',
          margin: '56px 0',
          maxWidth: '900px',
          paddingTop: '40px',
        }}
      >
        <h2 style={{ color: '#141414', fontSize: '40px', margin: '0 0 12px 0' }}>
          Ready to launch your CRM stack?
        </h2>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '18px',
            lineHeight: 1.6,
            margin: '0 0 24px 0',
          }}
        >
          Start with the hosted app or self-host for full control. ArjunaCRM is
          designed for teams who need speed without vendor lock-in.
        </p>
        <a
          href="https://app.vedpragya.com"
          style={{
            backgroundColor: '#141414',
            borderRadius: '8px',
            color: 'white',
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
            fontWeight: 600,
            padding: '12px 18px',
            textDecoration: 'none',
          }}
        >
          Create Workspace
        </a>
      </section>
    </ContentContainer>
  );
}
