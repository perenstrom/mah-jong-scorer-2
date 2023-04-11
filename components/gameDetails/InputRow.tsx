import { faWind, faCrown } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome';
import { Box, Stack, styled } from '@mui/joy';
import { MouseEventHandler } from 'react';

const ScoreInput = styled('input')`
  border: 0;
  font-size: 2rem;
  min-width: 0;
  padding: 0 0.5rem;
  text-align: end;

  :focus-visible {
    z-index: 1;
  }
`;

const ScoreAvatar: React.FC<{
  initials: string;
  color: { background: string; text: string };
}> = ({ initials, color }) => (
  <Box
    sx={{
      flex: '0 0 3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color.background,
      color: color.text,
      fontSize: '1.5rem'
    }}
  >
    {initials}
  </Box>
);

const Selector: React.FC<{
  icon: FontAwesomeIconProps['icon'];
  onClick: MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
}> = ({ icon, onClick, selected = false }) => (
  <Box
    sx={{
      flex: '0 0 3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 0,
      padding: 0,
      borderLeft: '1px solid #eee',
      backgroundColor: selected ? '#53a653' : 'white',
      cursor: 'pointer',
      ':focus-visible': {
        zIndex: 1
      }
    }}
    component="button"
    onClick={(event) => {
      event.preventDefault();
      onClick(event);
    }}
  >
    <FontAwesomeIcon color={selected ? 'white' : 'black'} icon={icon} />
  </Box>
);

export const InputRow: React.FC<{
  initials: string;
  color: { background: string; text: string };
  value: string;
  windSelected: boolean;
  winnerSelected: boolean;
  onValueChange: (value: string) => void;
  selectWind: () => void;
  selectWinner: () => void;
}> = ({
  initials,
  color,
  value,
  windSelected,
  winnerSelected,
  onValueChange,
  selectWind,
  selectWinner
}) => (
  <Stack sx={{ flex: '1', borderBottom: '1px solid #eee' }} direction="row">
    <ScoreAvatar initials={initials} color={color} />
    <ScoreInput
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    />
    <Selector
      icon={faWind}
      selected={windSelected}
      onClick={() => selectWind()}
    />
    <Selector
      icon={faCrown}
      selected={winnerSelected}
      onClick={() => selectWinner()}
    />
  </Stack>
);
