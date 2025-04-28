import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;ve sent you a verification link. Please check your inbox.
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Already verified?{" "}
            <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
