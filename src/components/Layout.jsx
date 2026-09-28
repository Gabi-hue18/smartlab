import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  QrCode,
  Wrench,
  TriangleAlert,
  History,
  Bell,
  BarChart3,
  FileText,
  Plus,
  LogOut,
  Moon,
  Sun,
  FlaskConical,
  Database,
  ChevronRight,
  Search,
  Command
} from 'lucide-react'

import { useEffect, useState } from 'react'
import { mode } from '../lib/store'

const mainItems = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/equipment', 'Equipment', Boxes],
  ['/scanner', 'QR Scanner', QrCode],
]

const operationItems = [
  ['/maintenance', 'Maintenance', Wrench],
  ['/faults', 'Fault Reports', TriangleAlert],
  ['/history', 'Service History', History],
]

const insightItems = [
  ['/documents', 'Documents', FileText],
  ['/notifications', 'Notifications', Bell],
  ['/analytics', 'Analytics', BarChart3],
]

function NavItem({ to, label, Icon }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        isActive
          ? 'modern-nav-link active'
          : 'modern-nav-link'
      }
    >
      <div className="nav-icon">
        <Icon size={18}/>
      </div>

      <span>{label}</span>

      <ChevronRight
        className="nav-arrow"
        size={14}
      />
    </NavLink>
  )
}

export default function Layout({ profile, onLogout }) {

  const [dark, setDark] = useState(
    localStorage.getItem('smartlab_theme') === 'dark'
  )

  useEffect(() => {

    document.documentElement.dataset.theme =
      dark ? 'dark' : 'light'

    localStorage.setItem(
      'smartlab_theme',
      dark ? 'dark' : 'light'
    )

  }, [dark])

  const initials =
    (profile?.full_name || 'User')
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (

    <div className="app-shell modern-shell">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar modern-sidebar">

        <div className="modern-brand">

          <div className="modern-brand-icon">
            <FlaskConical size={22}/>
          </div>

          <div className="modern-brand-text">
            <strong>SmartLab</strong>
            <span>Asset Intelligence</span>
          </div>

        </div>


        {/* ADD EQUIPMENT */}

        <NavLink
          to="/equipment/new"
          className="sidebar-add"
        >
          <Plus size={17}/>
          <span>Add Equipment</span>
        </NavLink>


        {/* NAVIGATION */}

        <div className="modern-nav-scroll">

          <div className="nav-group">

            <p>WORKSPACE</p>

            {mainItems.map(([to, label, Icon]) => (
              <NavItem
                key={to}
                to={to}
                label={label}
                Icon={Icon}
              />
            ))}

          </div>


          <div className="nav-group">

            <p>OPERATIONS</p>

            {operationItems.map(([to, label, Icon]) => (
              <NavItem
                key={to}
                to={to}
                label={label}
                Icon={Icon}
              />
            ))}

          </div>


          <div className="nav-group">

            <p>INTELLIGENCE</p>

            {insightItems.map(([to, label, Icon]) => (
              <NavItem
                key={to}
                to={to}
                label={label}
                Icon={Icon}
              />
            ))}

          </div>

        </div>


        {/* CLOUD STATUS */}

        <div className="sidebar-system">

          <div className="sidebar-system-icon">
            <Database size={16}/>
          </div>

          <div>
            <strong>
              {mode === 'cloud'
                ? 'Cloud connected'
                : 'Demo environment'
              }
            </strong>

            <span>
              {mode === 'cloud'
                ? 'Supabase database'
                : 'Local demonstration'
              }
            </span>
          </div>

          <span
            className={
              mode === 'cloud'
                ? 'connection-dot connected'
                : 'connection-dot'
            }
          ></span>

        </div>


        {/* SIDEBAR FOOTER */}

        <div className="modern-side-footer">

          <button
            className="modern-side-button"
            onClick={() => setDark(x => !x)}
          >

            {dark
              ? <Sun size={17}/>
              : <Moon size={17}/>
            }

            <span>
              {dark
                ? 'Light mode'
                : 'Dark mode'
              }
            </span>

          </button>


          <button
            className="modern-side-button logout"
            onClick={onLogout}
          >

            <LogOut size={17}/>

            <span>
              Sign out
            </span>

          </button>

        </div>

      </aside>


      {/* ================= WORKSPACE ================= */}

      <div className="workspace modern-workspace">

        {/* TOP BAR */}

        <header className="topbar modern-topbar">

          <div className="topbar-left">

            <div className="top-search">

              <Search size={17}/>

              <span>
                Search SmartLab
              </span>

              <div className="search-shortcut">
                <Command size={11}/>
                K
              </div>

            </div>

          </div>


          <div className="topbar-right">

            <div
              className={
                `cloud-indicator ${mode}`
              }
            >

              <span></span>

              {mode === 'cloud'
                ? 'Live database'
                : 'Demo mode'
              }

            </div>


            <NavLink
              to="/notifications"
              className="topbar-icon-button"
              title="Notifications"
            >
              <Bell size={19}/>
            </NavLink>


            <div className="topbar-divider"></div>


            <div className="modern-profile">

              <div className="modern-avatar">
                {initials}
              </div>

              <div className="modern-profile-info">

                <strong>
                  {profile?.full_name || 'User'}
                </strong>

                <span>
                  {profile?.role || 'staff'}
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* PAGE */}

        <main className="page modern-page">

          <Outlet context={{ profile }}/>

        </main>

      </div>

    </div>
  )
}
