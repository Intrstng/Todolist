import { styled, Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Reusable component (styled)

type MenuButtonProps = {
  customtheme?: Theme;
  background?: string;
};

export const MenuButton = styled(Button)<MenuButtonProps>(({ customtheme, background }) => ({
  minWidth: '110px',
  fontWeight: 'bold',
  boxShadow: `0 0 0 2px ${customtheme && customtheme.palette.primary.dark},
              4px 4px 0 0 ${customtheme && customtheme.palette.primary.dark}`,
  borderRadius: '2px',
  textTransform: 'capitalize',
  margin: '0 10px',
  padding: '8px 24px',
  color: customtheme && customtheme.palette.primary.contrastText,
  background: background || (customtheme && customtheme.palette.primary.light),
}));
