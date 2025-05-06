import { render } from '@testing-library/react';
import { Badge } from '../../../components/ui/badge';

describe('Badge', () => {
  it('renders with children', () => {
    const { getByText } = render(<Badge>New</Badge>);
    expect(getByText('New')).toBeInTheDocument();
  });
});
