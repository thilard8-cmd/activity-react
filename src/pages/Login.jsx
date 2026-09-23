import { useState } from 'react'
import { flushSync } from 'react-dom'

export default function Login({ onLogin, onGoogleLogin, onSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onLogin?.(email, password)
    } catch (err) {
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Incorrect email or password.'
          : err.message || 'Unable to log in.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setGoogleLoading(true)

    try {
      await onGoogleLogin?.()
    } catch (err) {
      setError(
        err.code === 'auth/popup-closed-by-user'
          ? 'Google sign-in was closed before finishing.'
          : err.message || 'Unable to sign in with Google.'
      )
    } finally {
      setGoogleLoading(false)
    }
  }

  function handleSignupClick() {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          onSignup?.()
        })
      })
    } else {
      onSignup?.()
    }
  }

  return (
    <div className="login-backdrop">
      <div className="login-card">
        <div
          className="login-zone-form"
          style={{ viewTransitionName: 'auth-form' }}
        >
          <h1>hisghd</h1>
          <h2 className="login-title">
            WELCOME BACK !
          </h2>

          <p className="login-subtitle">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="login-field">
              <label className="login-label">
                Email
              </label>

              <input
                type="email"
                className="login-input"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">
                Password
              </label>

              <div className="login-input-wrap">

                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <i
                    className={`bi ${
                      showPassword
                        ? 'bi-eye-slash'
                        : 'bi-eye'
                    }`}
                  ></i>
                </button>

              </div>
            </div>

            <div className="login-row-between">

              <label className="login-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />

                Remember me

              </label>

              <a
                className="login-link"
                href="#forgot-password"
              >
                Forgot password
              </a>

            </div>

            {error && (
              <div
                className="alert alert-danger py-2"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              className="btn btn-dark btn-lg w-100"
              type="submit"
              disabled={loading || googleLoading}
            >
              {loading
                ? 'Logging in...'
                : 'Login'}
            </button>

          </form>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="login-btn-google btn-outline-secondary"
            disabled={loading || googleLoading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width="18"
              height="18"
            />

            {googleLoading
              ? 'Signing in...'
              : 'Sign in with Google'}
          </button>

          <div className="login-signup">

            Don't have an account?{' '}

            <button
              type="button"
              className="login-link login-link-btn"
              onClick={handleSignupClick}
            >
              Sign up
            </button>

          </div>

        </div>

        <div
          className="login-zone-image"
          style={{ viewTransitionName: 'auth-photo' }}
        >

          <div className="login-brand">
            <span>
              Padyak-All <i className="bi bi-bicycle"></i>
            </span>
          </div>

          <div className="login-zone-copy">

            <h1>
              Your next ride awaits!
            </h1>

            <p>
              Log in to track your rides, join community events,
              and pick up right where you left the trail.
            </p>

            <div className="login-tag">
              Ride together. Ride further.
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}