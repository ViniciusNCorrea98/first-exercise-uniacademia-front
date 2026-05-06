import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(user);
  const [name, setName] = useState(user?.name || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    setCurrentUser(user);
    setName(user?.name || '');
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess('');
    setError('');

    if (!currentUser) {
      setError('User not found.');
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const updatedUser = updateUser({ name });
      setCurrentUser(updatedUser);
      setSuccess('Profile updated successfully.');
    } catch (updateError) {
      setError('Could not update the profile.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px' }}>Profile</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>
          View and update your personal information.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '640px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ margin: '0 0 12px' }}>
            <strong>Name:</strong> {currentUser?.name}
          </p>
          <p style={{ margin: '0 0 12px' }}>
            <strong>Email:</strong> {currentUser?.email}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Type:</strong> {currentUser?.type}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="message message-error">{error}</p>}
          {success && <p className="message message-success">{success}</p>}

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Edit name
            </label>
            <input
              className="input"
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <button
            className="button"
            type="submit"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            disabled={isSaving}
            style={{
              transition: 'background-color 0.2s ease',
              backgroundColor: isButtonHovered ? '#1f2937' : '#111827',
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
