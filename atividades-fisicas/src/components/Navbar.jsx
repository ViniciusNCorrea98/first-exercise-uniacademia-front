import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const linkStyle = ({ isActive }) => ({
  padding: '8px 12px',
  borderRadius: '8px',
  color: isActive ? '#111827' : '#4b5563',
  backgroundColor: isActive ? '#e5e7eb' : 'transparent',
  transition: 'all 0.2s ease',
});

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) {
    return null;
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div
        className="container"
        style={{
          paddingTop: '16px',
          paddingBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ fontWeight: '700', color: '#111827' }}>Fitness App</div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <NavLink
            to="/dashboard"
            style={linkStyle}
            onMouseEnter={(event) => {
              if (!event.currentTarget.getAttribute('aria-current')) {
                event.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(event) => {
              if (!event.currentTarget.getAttribute('aria-current')) {
                event.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/activities"
            style={linkStyle}
            onMouseEnter={(event) => {
              if (!event.currentTarget.getAttribute('aria-current')) {
                event.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(event) => {
              if (!event.currentTarget.getAttribute('aria-current')) {
                event.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Activities
          </NavLink>
          <NavLink
            to="/profile"
            style={linkStyle}
            onMouseEnter={(event) => {
              if (!event.currentTarget.getAttribute('aria-current')) {
                event.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(event) => {
              if (!event.currentTarget.getAttribute('aria-current')) {
                event.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Profile
          </NavLink>
          <button
            type="button"
            className="button"
            onClick={handleLogout}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = '#1f2937';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = '#111827';
            }}
            style={{ transition: 'background-color 0.2s ease' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
