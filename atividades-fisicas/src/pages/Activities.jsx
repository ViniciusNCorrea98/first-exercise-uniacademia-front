import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { getActivities, saveActivities } from '../services/storage';

const initialFormData = {
  date: '',
  type: '',
  duration: '',
  calories: '',
};

function Activities() {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredButton, setHoveredButton] = useState('');

  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }

    const allActivities = getActivities();
    const userActivities = allActivities.filter(
      (activity) => activity.userId === user.id
    );

    setActivities(userActivities);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback('');
    setError('');
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const allActivities = getActivities();

      if (editingId) {
        const updatedActivities = allActivities.map((activity) =>
          activity.id === editingId
            ? {
                ...activity,
                ...formData,
              }
            : activity
        );

        saveActivities(updatedActivities);
        setActivities(
          updatedActivities.filter((activity) => activity.userId === user.id)
        );
        setFeedback('Activity updated successfully.');
        resetForm();
        return;
      }

      const newActivity = {
        id: Date.now().toString(),
        userId: user.id,
        date: formData.date,
        type: formData.type,
        duration: formData.duration,
        calories: formData.calories,
        createdAt: new Date().toISOString(),
      };

      const updatedActivities = [...allActivities, newActivity];

      saveActivities(updatedActivities);
      setActivities(
        updatedActivities.filter((activity) => activity.userId === user.id)
      );
      setFeedback('Activity added successfully.');
      resetForm();
    } catch (saveError) {
      setError('Could not save the activity.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(activity) {
    setFeedback('');
    setError('');
    setEditingId(activity.id);
    setFormData({
      date: activity.date,
      type: activity.type,
      duration: activity.duration,
      calories: activity.calories,
    });
  }

  function handleDelete(activityId) {
    setFeedback('');
    setError('');
    const allActivities = getActivities();
    const updatedActivities = allActivities.filter(
      (activity) => activity.id !== activityId
    );

    saveActivities(updatedActivities);
    setActivities(updatedActivities.filter((activity) => activity.userId === user.id));
    setFeedback('Activity removed successfully.');

    if (editingId === activityId) {
      resetForm();
    }
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px' }}>Activities</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Add, edit, and manage your activity history.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 320px) 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div className="card">
          <h2 style={{ margin: '0 0 16px' }}>
            {editingId ? 'Edit activity' : 'New activity'}
          </h2>

          <form onSubmit={handleSubmit}>
            {error && <p className="message message-error">{error}</p>}
            {feedback && <p className="message message-success">{feedback}</p>}

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="date"
                style={{ display: 'block', marginBottom: '8px' }}
              >
                Date
              </label>
              <input
                className="input"
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="type"
                style={{ display: 'block', marginBottom: '8px' }}
              >
                Type
              </label>
              <input
                className="input"
                id="type"
                name="type"
                type="text"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="duration"
                style={{ display: 'block', marginBottom: '8px' }}
              >
                Duration
              </label>
              <input
                className="input"
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="calories"
                style={{ display: 'block', marginBottom: '8px' }}
              >
                Calories
              </label>
              <input
                className="input"
                id="calories"
                name="calories"
                type="number"
                value={formData.calories}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="button"
                type="submit"
                onMouseEnter={() => setHoveredButton('save')}
                onMouseLeave={() => setHoveredButton('')}
                disabled={isSaving}
                style={{
                  backgroundColor:
                    hoveredButton === 'save' ? '#1f2937' : '#111827',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {isSaving
                  ? 'Saving...'
                  : editingId
                    ? 'Update activity'
                    : 'Add activity'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  onMouseEnter={() => setHoveredButton('cancel')}
                  onMouseLeave={() => setHoveredButton('')}
                  style={{
                    padding: '10px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor:
                      hoveredButton === 'cancel' ? '#f3f4f6' : '#ffffff',
                    color: '#111827',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 16px' }}>Activity list</h2>

          {activities.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280' }}>No activities found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#6b7280' }}>
                    <th style={{ padding: '0 0 12px' }}>Date</th>
                    <th style={{ padding: '0 0 12px' }}>Type</th>
                    <th style={{ padding: '0 0 12px' }}>Duration</th>
                    <th style={{ padding: '0 0 12px' }}>Calories</th>
                    <th style={{ padding: '0 0 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 0' }}>{activity.date}</td>
                      <td style={{ padding: '16px 0' }}>{activity.type}</td>
                      <td style={{ padding: '16px 0' }}>{activity.duration} min</td>
                      <td style={{ padding: '16px 0' }}>{activity.calories}</td>
                      <td style={{ padding: '16px 0' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(activity)}
                            onMouseEnter={() =>
                              setHoveredButton(`edit-${activity.id}`)
                            }
                            onMouseLeave={() => setHoveredButton('')}
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                hoveredButton === `edit-${activity.id}`
                                  ? '#1d4ed8'
                                  : '#2563eb',
                              color: '#ffffff',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(activity.id)}
                            onMouseEnter={() =>
                              setHoveredButton(`delete-${activity.id}`)
                            }
                            onMouseLeave={() => setHoveredButton('')}
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor:
                                hoveredButton === `delete-${activity.id}`
                                  ? '#b91c1c'
                                  : '#dc2626',
                              color: '#ffffff',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activities;
