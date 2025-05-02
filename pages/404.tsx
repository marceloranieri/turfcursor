import ErrorPage from '@/components/error/ErrorPage';

export default function Custom404() {
  return (
    <ErrorPage
      title="404 - Page Not Found"
      message="The page you're looking for doesn't exist."
    />
  );
} 