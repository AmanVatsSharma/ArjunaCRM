import { type Decorator } from '@storybook/react';
import { IconsProvider } from 'arjuna-ui/display';

export const IconsProviderDecorator: Decorator = (Story) => {
  return (
    <IconsProvider>
      <Story />
    </IconsProvider>
  );
};
