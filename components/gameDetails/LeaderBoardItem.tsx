import {  Stack, Typography } from '@mui/joy';

export const LeaderBoardItem: React.FC<{
  name: string;
  points: number;
  color: string;
}> = ({ name, points, color }) => (
  <Stack
    direction="row"
    sx={{
      flexGrow: '1',
      justifyContent: 'space-between',
      p: 1,
      pl: 2,
      alignItems: 'baseline',
      borderBottom: '1px solid #eee',
      background: `linear-gradient(90deg, ${color} 0%, ${color}00 100%) left/1.7rem no-repeat`
    }}
    component="li"
  >
    <Typography level="h4" component="p" sx={{ flexGrow: 1 }}>
      {name}
    </Typography>
    <Typography level="h3" component="p" sx={{ flexGrow: 0 }}>
      {points}
    </Typography>
  </Stack>
);
