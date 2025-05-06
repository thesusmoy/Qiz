import { render } from '@testing-library/react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../../components/ui/avatar';

describe('Avatar', () => {
  it('renders image with alt text', () => {
    const { getByAltText } = render(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="User Avatar" />
      </Avatar>
    );
    expect(getByAltText('User Avatar')).toBeInTheDocument();
  });

  it('renders fallback if image fails', () => {
    const { getByText } = render(
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
    expect(getByText('U')).toBeInTheDocument();
  });
});
