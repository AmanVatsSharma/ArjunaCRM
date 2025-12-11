import { type Meta, type StoryObj } from '@storybook/react';
import { expect, waitFor, within } from '@storybook/test';

import { LinksDisplay } from '@/ui/field/display/components/LinksDisplay';
import { ComponentDecorator } from 'arjuna-ui/testing';

const meta: Meta<typeof LinksDisplay> = {
  title: 'UI/Display/LinksDisplay',
  component: LinksDisplay,
  decorators: [ComponentDecorator],
  argTypes: {
    value: {
      control: 'object',
      description:
        'The value object containing primaryLinkUrl, primaryLinkLabel, and secondaryLinks',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LinksDisplay>;

export const NoLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: '',
      primaryLinkLabel: '',
      secondaryLinks: [],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.queryByRole('link')).toBeNull();
    });
  },
};

export const NullLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: null,
      primaryLinkLabel: 'Primary Link',
      secondaryLinks: [
        { url: null, label: 'Secondary Link' },
        { url: 'https://www.vedpragya.com', label: 'Valid Link' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(1);
    });

    const validLink = await canvas.findByText('Valid Link');
    expect(validLink).toBeVisible();
    expect(validLink).toHaveAttribute('href', 'https://www.vedpragya.com');

    expect(canvas.queryByText('Primary Link')).not.toBeInTheDocument();
    expect(canvas.queryByText('Secondary Link')).not.toBeInTheDocument();
  },
};

export const SingleLink: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.vedpragya.com',
      primaryLinkLabel: 'ArjunaCRM Website',
      secondaryLinks: null,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = await canvas.findByRole('link');
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', 'https://www.vedpragya.com');
    expect(link).toHaveTextContent('ArjunaCRM Website');

    await waitFor(() => {
      expect(canvas.getAllByRole('link')).toHaveLength(1);
    });
  },
};

export const MultipleLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.vedpragya.com',
      primaryLinkLabel: 'ArjunaCRM Website',
      secondaryLinks: [
        { url: 'https://docs.vedpragya.com', label: 'Documentation' },
        { url: 'https://blog.vedpragya.com', label: 'Blog' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(3);
    });

    const primaryLink = await canvas.findByText('ArjunaCRM Website');
    expect(primaryLink).toBeVisible();
    expect(primaryLink).toHaveAttribute('href', 'https://www.vedpragya.com');

    const docsLink = await canvas.findByText('Documentation');
    expect(docsLink).toBeVisible();
    expect(docsLink).toHaveAttribute('href', 'https://docs.vedpragya.com');

    const blogLink = await canvas.findByText('Blog');
    expect(blogLink).toBeVisible();
    expect(blogLink).toHaveAttribute('href', 'https://blog.vedpragya.com');
  },
};

export const SocialMediaLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.linkedin.com/company/arjuna',
      primaryLinkLabel: 'ArjunaCRM on LinkedIn',
      secondaryLinks: [
        { url: 'https://twitter.com/arjunacrm', label: 'ArjunaCRM on Twitter' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(2);
    });

    const linkedinLink = await canvas.findByText('arjuna');
    expect(linkedinLink).toBeVisible();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/arjuna',
    );

    const twitterLink = await canvas.findByText('@arjunacrm');
    expect(twitterLink).toBeVisible();
    expect(twitterLink).toHaveAttribute(
      'href',
      'https://twitter.com/arjunacrm',
    );
  },
};

export const AutomaticLabelFromURL: Story = {
  args: {
    value: {
      primaryLinkUrl: 'https://www.example.com',
      primaryLinkLabel: '',
      secondaryLinks: [{ url: 'https://test.example.com', label: null }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      const links = canvas.queryAllByRole('link');
      expect(links).toHaveLength(2);
    });

    const primaryLink = await canvas.findByText('www.example.com');
    expect(primaryLink).toBeVisible();
    expect(primaryLink).toHaveAttribute('href', 'https://www.example.com');

    const secondaryLink = await canvas.findByText('test.example.com');
    expect(secondaryLink).toBeVisible();
    expect(secondaryLink).toHaveAttribute('href', 'https://test.example.com');
  },
};

export const InvalidLinks: Story = {
  args: {
    value: {
      primaryLinkUrl: 'wikipedia',
      primaryLinkLabel: 'Invalid URL',
      secondaryLinks: [{ url: 'lydia,com', label: 'Invalid URL with comma' }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.queryByRole('link')).toBeNull();
    });

    expect(canvas.queryByText('Invalid URL')).not.toBeInTheDocument();
    expect(
      canvas.queryByText('Invalid URL with comma'),
    ).not.toBeInTheDocument();
  },
};
