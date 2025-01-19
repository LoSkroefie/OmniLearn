import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient, gql } from '@apollo/client';

const AuthContext = createContext(null);

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      points
      role
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      client.query({ query: ME_QUERY })
        .then(({ data }) => {
          setUser(data.me);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [client]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    client.resetStore();
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
