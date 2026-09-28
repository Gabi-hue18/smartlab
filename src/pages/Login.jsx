import { useState } from 'react'
import {
  FlaskConical,
  Microscope,
  ShieldCheck,
  Wrench,
  QrCode,
  BarChart3,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  Activity,
  CheckCircle2
} from 'lucide-react'
import { signIn } from '../lib/store'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@smartlab.com')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')

    try {
      const session = await signIn(email, password)
      onLogin(session)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="smart-login">

      {/* Decorative background */}
      <div className="login-grid"></div>
      <div className="login-glow glow-one"></div>
      <div className="login-glow glow-two"></div>

      {/* LEFT SIDE */}
      <section className="smart-login-left">

        <div className="login-brand">
          <div className="login-logo">
            <FlaskConical size={27} />
          </div>

          <div>
            <strong>SmartLab</strong>
            <span>Laboratory Asset Intelligence</span>
          </div>
        </div>

        <div className="login-hero">

          <div className="system-badge">
            <span className="live-dot"></span>
            SMART LAB SYSTEM ONLINE
          </div>

          <h1>
            Smarter labs.
            <br />
            <span>Better decisions.</span>
          </h1>

          <p className="hero-description">
            A unified platform for managing laboratory equipment,
            maintenance, faults, calibration and asset intelligence.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <div className="feature-icon">
                <Microscope size={21} />
              </div>

              <div>
                <strong>Asset Management</strong>
                <span>Track every laboratory asset</span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">
                <QrCode size={21} />
              </div>

              <div>
                <strong>QR Identification</strong>
                <span>Instant equipment information</span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">
                <Wrench size={21} />
              </div>

              <div>
                <strong>Smart Maintenance</strong>
                <span>Manage service & repair cycles</span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">
                <BarChart3 size={21} />
              </div>

              <div>
                <strong>Asset Intelligence</strong>
                <span>Insights, reports & analytics</span>
              </div>
            </div>

          </div>
        </div>

        <div className="login-trust-bar">

          <div>
            <ShieldCheck size={18} />
            <span>
              <strong>Secure access</strong>
              Role-based permissions
            </span>
          </div>

          <div>
            <Database size={18} />
            <span>
              <strong>Cloud connected</strong>
              Supabase database
            </span>
          </div>

          <div>
            <Activity size={18} />
            <span>
              <strong>Live insights</strong>
              Real-time operations
            </span>
          </div>

        </div>

      </section>

      {/* RIGHT SIDE */}
      <section className="smart-login-right">

        <div className="login-form-area">

          <div className="mobile-login-brand">
            <div className="login-logo">
              <FlaskConical size={24} />
            </div>
            <strong>SmartLab</strong>
          </div>

          <div className="login-status">
            <CheckCircle2 size={15} />
            Secure laboratory portal
          </div>

          <div className="login-heading">
            <p>SMART LABORATORY OPERATIONS</p>

            <h2>Welcome back</h2>

            <span>
              Enter your credentials to access your laboratory workspace.
            </span>
          </div>

          <form onSubmit={submit}>

            <div className="modern-field">
              <label>Email address</label>

              <div className="input-container">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@smartlab.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="modern-field">

              <div className="password-label">
                <label>Password</label>
                <span>Secure access</span>
              </div>

              <div className="input-container password-container">

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />
                  }
                </button>

              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              className="modern-signin"
              disabled={busy}
              type="submit"
            >
              <span>
                {busy ? 'Signing in...' : 'Sign in to SmartLab'}
              </span>

              {!busy && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="login-divider">
            <span></span>
            <p>AUTHORIZED ACCESS</p>
            <span></span>
          </div>

          <div className="role-access">

            <div>
              <ShieldCheck size={18} />
              <span>
                <strong>Admin</strong>
                Full control
              </span>
            </div>

            <div>
              <Microscope size={18} />
              <span>
                <strong>Staff</strong>
                Lab operations
              </span>
            </div>

            <div>
              <Wrench size={18} />
              <span>
                <strong>Technician</strong>
                Maintenance
              </span>
            </div>

          </div>

          <p className="login-help">
            Access is provided by your laboratory administrator.
          </p>

        </div>

        <div className="login-footer">
          <span>© {new Date().getFullYear()} SmartLab</span>
          <span>Laboratory Asset Management Platform</span>
        </div>

      </section>

    </div>
  )
}
