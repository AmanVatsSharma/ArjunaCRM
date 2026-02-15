import { ContentContainer } from '@/app/_components/ui/layout/ContentContainer';

export const metadata = {
  title: 'ArjunaCRM - Jobs',
  description:
    'Join ArjunaCRM. Explore open roles across engineering and business operations.',
};

const openRoles = [
  'Software Engineering Intern',
  'Senior Software Engineer',
  'Business Operations Intern',
];

export default function JobsPage() {
  return (
    <ContentContainer>
      <section style={{ marginTop: '64px', maxWidth: '860px' }}>
        <h1 style={{ color: '#141414', fontSize: '48px', margin: 0 }}>
          Join us
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
          We are building the next generation of open source CRM software and
          we are hiring people who care about product quality, customer empathy,
          and fast execution.
        </p>
      </section>

      <section style={{ margin: '28px 0 56px 0', maxWidth: '860px' }}>
        {openRoles.map((role) => (
          <article
            key={role}
            style={{
              alignItems: 'center',
              borderBottom: '1px solid #ebebeb',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '18px 0',
            }}
          >
            <h2
              style={{
                color: '#141414',
                fontFamily: 'var(--font-inter)',
                fontSize: '20px',
                margin: 0,
              }}
            >
              {role}
            </h2>
            <a
              href="mailto:founders@vedpragya.com?subject=Application%20for%20ArjunaCRM"
              style={{
                backgroundColor: '#141414',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                fontWeight: 600,
                padding: '10px 14px',
                textDecoration: 'none',
              }}
            >
              Apply
            </a>
          </article>
        ))}
      </section>
    </ContentContainer>
  );
}
