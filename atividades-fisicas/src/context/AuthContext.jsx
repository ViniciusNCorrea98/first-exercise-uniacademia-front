import { createContext, useContext, useEffect, useState } from 'react';
import mockUsers from '../mocks/mockUsers';

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = 'users';
const USER_STORAGE_KEY = 'user';

function getStoredUsers() {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
}

function getStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  function login(email, password) {
    const users = [...mockUsers, ...getStoredUsers()];
    const foundUser = users.find(
      (storedUser) =>
        storedUser.email === email && storedUser.password === password
    );

    if (!foundUser) {
      throw new Error('Email ou senha invalidos.');
    }

    setUser(foundUser);
    return foundUser;
  }

  function register({ name, email, password, type }) {
    const users = getStoredUsers();
    const allUsers = [...mockUsers, ...users];
    const userAlreadyExists = allUsers.some(
      (storedUser) => storedUser.email === email
    );

    if (userAlreadyExists) {
      throw new Error('Ja existe um usuario com este email.');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      type,
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    return newUser;
  }

  function updateUser(updatedFields) {
    if (!user) {
      return null;
    }

    const updatedUser = {
      ...user,
      ...updatedFields,
    };
    const users = getStoredUsers();
    const updatedUsers = users.map((storedUser) =>
      storedUser.id === updatedUser.id ? updatedUser : storedUser
    );

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    setUser(updatedUser);

    return updatedUser;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
