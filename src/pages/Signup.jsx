import { useState } from 'react'
import { flushSync } from 'react-dom'

export default function Signup({ onSignup, onBackToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      await onSignup?.({
        name,
        email,
        password
      })
    } catch (err) {
      const messages = {
        'auth/email-already-in-use':
          'This email is already registered.',

        'auth/invalid-email':
          'Please enter a valid email address.',

        'auth/weak-password':
          'Password is too weak.',
      }

      setError(
        messages[err.code] ||
        err.message ||
        'Unable to create account.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleBackToLogin() {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          onBackToLogin?.()
        })
      })
    } else {
      onBackToLogin?.()
    }
  }

  return (
    <div className="signup-backdrop">

      <div className="signup-card">

        {/* LEFT PHOTO */}
        <div
          className="signup-zone-image"
          style={{ viewTransitionName: 'auth-photo' }}
        >

          <div className="signup-brand">
            <span>
              Padyak-All <i className="bi bi-bicycle"></i>
            </span>
          </div>

          <div className="signup-zone-copy">

            <h1>
              Start your ride today!
            </h1>

            <p>
              Create your account and discover new routes,
              connect with riders, and enjoy every journey.
            </p>

            <div className="signup-tag">
              Ride together. Ride further.
            </div>

          </div>

        </div>

        {/* RIGHT FORM */}
        <div
          className="signup-zone-form"
          style={{ viewTransitionName: 'auth-form' }}
        >

          <h2 className="signup-title">
            CREATE ACCOUNT
          </h2>

          <p className="signup-subtitle">
            Join Padyak-All and start your journey.
          </p>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="signup-field">

              <label className="signup-label">
                Name
              </label>

              <input
                type="text"
                className="signup-input"
                placeholder="Enter your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>

            {/* EMAIL */}
            <div className="signup-field">

              <label className="signup-label">
                Email
              </label>

              <input
                type="email"
                className="signup-input"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="signup-field">

              <label className="signup-label">
                Password
              </label>

              <div className="signup-input-wrap">

                <input
                  type={showPassword ? 'text' : 'password'}
                  className="signup-input"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="signup-eye"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
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

            {/* CONFIRM PASSWORD */}
            <div className="signup-field">

              <label className="signup-label">
                Confirm Password
              </label>

              <div className="signup-input-wrap">

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  className="signup-input"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="signup-eye"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <i
                    className={`bi ${
                      showConfirmPassword
                        ? 'bi-eye-slash'
                        : 'bi-eye'
                    }`}
                  ></i>
                </button>

              </div>

            </div>

            {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
            )}

            <button
              className="btn btn-dark btn-lg w-100"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Sign Up'}
            </button>

          </form>

          <div className="signup-login">

            Already have an account?{' '}

            <button
              type="button"
              className="signup-link signup-link-btn"
              onClick={handleBackToLogin}
              disabled={loading}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}