import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('aluno');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      register({ name, email, password, type });
      setSuccess('User created successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 700);
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <h1 style={{ marginTop: 0, marginBottom: '24px' }}>Register</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="name"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Name
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

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Email
            </label>
            <input
              className="input"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Password
            </label>
            <input
              className="input"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            <select
              className="input"
              id="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="aluno">Aluno</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {error && <p className="message message-error">{error}</p>}
          {success && <p className="message message-success">{success}</p>}

          <input
            className="button"
            type="submit"
            value={isLoading ? 'Cadastrando...' : 'Cadastrar'}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            disabled={isLoading}
            style={{
              width: '100%',
              transition: 'background-color 0.2s ease',
              backgroundColor: isButtonHovered ? '#1f2937' : '#111827',
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default Register;
