import { NextPage } from 'next';
import {
  useUser,
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0';

interface Props {}

const MePage: NextPage<Props> = ({}) => {
  const { user } = useUser();

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
};

export default withPageAuthRequired<Props & WithPageAuthRequiredProps>(MePage);
