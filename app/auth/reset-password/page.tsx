import Link from "next/link"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Please enter your new password below.
          </p>
        </div>
        <form className="space-y-6">
          <input
            type="password"
            required
            placeholder="New password"
            className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
          <button
            type="submit"
            className="w-full rounded-message bg-accent-primary p-3 text-sm font-medium text-white hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          >
            Update Password
          </button>
          <p className="mt-4 text-center text-sm text-text-secondary">
            Remembered it?{" "}
            <Link href="/auth/signin" className="text-accent-primary hover:text-accent-primary-dark">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
