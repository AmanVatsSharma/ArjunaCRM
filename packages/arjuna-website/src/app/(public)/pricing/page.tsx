import { ContentContainer } from '@/app/_components/ui/layout/ContentContainer';

export const metadata = {
  title: 'ArjunaCRM - Pricing',
  description:
    'Simple pricing for teams adopting ArjunaCRM. Start free, scale to managed support as your revenue operations grow.',
};

const pricingTiers = [
  {
    ctaLabel: 'Start Free',
    ctaLink: 'https://app.vedpragya.com',
    description:
      'For small teams validating pipeline workflows and CRM customization.',
    name: 'Starter',
    price: '$0',
  },
  {
    ctaLabel: 'Talk to Sales',
    ctaLink: 'mailto:founders@vedpragya.com',
    description:
      'For teams needing onboarding help, managed updates, and custom setup.',
    name: 'Growth',
    price: '$49 / workspace / month',
  },
  {
    ctaLabel: 'Contact Us',
    ctaLink: 'mailto:founders@vedpragya.com',
    description:
      'For organizations requiring SLAs, security reviews, and custom terms.',
    name: 'Enterprise',
    price: 'Custom',
  },
];

export default function PricingPage() {
  return (
    <ContentContainer>
      <section style={{ marginTop: '64px', maxWidth: '900px' }}>
        <h1 style={{ color: '#141414', fontSize: '48px', margin: 0 }}>
          Pricing that scales with your team
        </h1>
        <p
          style={{
            color: '#525252',
            fontFamily: 'var(--font-inter)',
            fontSize: '18px',
            lineHeight: 1.6,
            marginTop: '16px',
          }}
        >
          ArjunaCRM is open source by design. Choose the plan that matches your
          current stage, then scale support as your GTM engine grows.
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          margin: '32px 0 56px 0',
          width: '100%',
        }}
      >
        {pricingTiers.map((tier) => (
          <article
            key={tier.name}
            style={{
              background: '#fafafa',
              border: '1px solid #ebebeb',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h2 style={{ color: '#141414', fontSize: '26px', margin: 0 }}>
              {tier.name}
            </h2>
            <p
              style={{
                color: '#141414',
                fontFamily: 'var(--font-inter)',
                fontSize: '20px',
                fontWeight: 600,
                margin: '12px 0',
              }}
            >
              {tier.price}
            </p>
            <p
              style={{
                color: '#525252',
                fontFamily: 'var(--font-inter)',
                fontSize: '15px',
                lineHeight: 1.6,
                margin: '0 0 18px 0',
              }}
            >
              {tier.description}
            </p>
            <a
              href={tier.ctaLink}
              style={{
                backgroundColor: '#141414',
                borderRadius: '8px',
                color: 'white',
                display: 'inline-block',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                fontWeight: 600,
                padding: '10px 14px',
                textDecoration: 'none',
              }}
            >
              {tier.ctaLabel}
            </a>
          </article>
        ))}
      </section>
    </ContentContainer>
  );
}
