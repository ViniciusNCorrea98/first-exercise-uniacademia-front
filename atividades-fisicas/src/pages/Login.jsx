import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      login(email, password);
      navigate('/dashboard');
    } catch (loginError) {
      setError('Usuario nao encontrado.');
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
        <h1 style={{ marginTop: 0, marginBottom: '24px' }}>Login</h1>

        <form onSubmit={handleSubmit}>
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

          {error && <p className="message message-error">{error}</p>}

          <input
            className="button"
            type="submit"
            value={isLoading ? 'Entrando...' : 'Entrar'}
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

        <div style={{ marginTop: '24px', color: '#4b5563', fontSize: '14px' }}>
          <p style={{ margin: '0 0 4px' }}>Email mock: aluno@teste.com</p>
          <p style={{ margin: 0 }}>Senha mock: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
