import ErrorPage from '@/components/error/ErrorPage';

export default function Custom500() {
  return (
    <ErrorPage
      title="500 - Server Error"
      message="We're sorry, something went wrong on our end."
    />
  );
} 