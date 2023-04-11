import { Stack, Typography } from '@mui/joy';

export const LeaderBoardItem: React.FC<{ name: string; points: number }> = ({
  name,
  points
}) => (
  <Stack
    direction="row"
    sx={{
      flexGrow: '1',
      justifyContent: 'space-between',
      p: 1,
      alignItems: 'baseline',
      borderBottom: '1px solid #eee'
    }}
    component="li"
  >
    <Typography level="h4" component="p">
      {name}
    </Typography>
    <Typography level="h3" component="p">
      {points}
    </Typography>
  </Stack>
);
