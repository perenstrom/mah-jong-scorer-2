import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import React from 'react';
import { User } from 'types/types';

export interface Input {
  player1User: string;
  player2User: string;
  player3User: string;
  player4User: string;
}

interface Props {
  playerNumber: 1 | 2 | 3 | 4;
  value: string;
  availablePlayers: User[];
  action: React.MutableRefObject<null>;
  handleChange: (key: keyof Input, value: string) => void;
}

export const UserSelector: React.FC<Props> = ({
  playerNumber,
  value,
  handleChange,
  availablePlayers,
  action
}) => {
  return (
    <FormControl>
      <FormLabel>Player {playerNumber} (user)</FormLabel>
      <Select
        placeholder="Choose player"
        value={value}
        onChange={(_, value) =>
          handleChange(`player${playerNumber}User`, value || '')
        }
        {...(value && {
          endDecorator: (
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() => {
                handleChange(`player${playerNumber}User`, '');
                // @ts-ignore
                action.current?.focusVisible();
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          ),
          indicator: null
        })}
      >
        {availablePlayers.map((user) => (
          <Option key={user.userId} value={user.userId}>
            {user.name}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};
