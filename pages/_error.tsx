import { NextPage } from 'next';
import ErrorPage from '@/components/error/ErrorPage';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => (
  <ErrorPage
    title={statusCode ? `Error ${statusCode}` : 'An error occurred'}
    message="We're sorry for the inconvenience."
  />
);

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 