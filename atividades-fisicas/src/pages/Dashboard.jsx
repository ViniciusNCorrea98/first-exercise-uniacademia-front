import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { getActivities } from '../services/storage';

const WEEKLY_GOAL = 5;

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [userActivities, setUserActivities] = useState([]);

  useEffect(() => {
    if (!user) {
      setUserActivities([]);
      return;
    }

    const activities = getActivities();

    const filteredActivities = activities.filter((activity) => {
      return (
        activity.userId === user.id ||
        activity.alunoId === user.id ||
        activity.personalId === user.id ||
        activity.email === user.email
      );
    });

    const sortedActivities = [...filteredActivities].sort((a, b) => {
      const firstDate = new Date(
        b.createdAt || b.date || Number(b.id) || 0
      ).getTime();
      const secondDate = new Date(
        a.createdAt || a.date || Number(a.id) || 0
      ).getTime();

      return firstDate - secondDate;
    });

    setUserActivities(sortedActivities);
  }, [user]);

  const lastActivities = userActivities.slice(0, 3);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyActivitiesCount = userActivities.filter((activity) => {
    const activityDate = new Date(activity.date || activity.createdAt);
    return activityDate >= sevenDaysAgo;
  }).length;

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px' }}>Dashboard</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Welcome, {user?.name || 'User'}!
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="card">
          <p style={{ margin: '0 0 8px', color: '#6b7280' }}>
            Total activities
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
            }}
          >
            {userActivities.length}
          </p>
        </div>

        <div className="card">
          <p style={{ margin: '0 0 8px', color: '#6b7280' }}>Weekly goal</p>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
            }}
          >
            {weeklyActivitiesCount}/{WEEKLY_GOAL}
          </p>
          <p
            style={{
              margin: 0,
              color: weeklyActivitiesCount >= WEEKLY_GOAL ? '#15803d' : '#4b5563',
            }}
          >
            {weeklyActivitiesCount >= WEEKLY_GOAL
              ? 'Goal completed!'
              : 'Keep going!'}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 16px' }}>Recent activities</h2>

        {lastActivities.length === 0 ? (
          <p style={{ margin: 0, color: '#6b7280' }}>No activities found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {lastActivities.map((activity, index) => (
              <li
                key={activity.id}
                style={{
                  padding: '12px 0',
                  borderBottom:
                    index === lastActivities.length - 1
                      ? 'none'
                      : '1px solid #e5e7eb',
                }}
              >
                <p
                  style={{
                    margin: '0 0 4px',
                    fontWeight: '600',
                    color: '#111827',
                  }}
                >
                  {activity.type || activity.name || activity.title || 'Activity'}
                </p>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {activity.date || 'No date'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
