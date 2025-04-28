import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form className="space-y-6">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
          <div className="text-right text-sm">
            <Link href="/auth/forgot-password" className="text-accent-primary hover:text-accent-primary-dark">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded-message bg-accent-primary p-3 text-sm font-medium text-white hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          >
            Sign In
          </button>
          <p className="mt-4 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-accent-primary hover:text-accent-primary-dark">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
