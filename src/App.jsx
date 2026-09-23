import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Display from './components/Display.jsx';
import RiderDashboard from './pages/RiderDashboard.jsx';

import { auth, googleProvider, db } from './firebase.js';


function ProtectedRoute({ user, role, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    if (role === 'rider') {
      return <Navigate to="/rider-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

function LoginPage({
  handleLogin,
  handleGoogleLogin,
}) {
  const navigate = useNavigate();

  return (
    <Login
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignup={() => navigate('/signup')}
    />
  );
}

function SignupPage({ handleSignup }) {
  const navigate = useNavigate();

  return (
    <Signup
      onSignup={handleSignup}
      onBackToLogin={() => navigate('/login')}
    />
  );
}

function AdminPage({ user, handleLogout }) {
  return (
    <Display
      user={user}
      role="admin"
      onLogout={handleLogout}
    />
  );
}

function RiderPage({ handleLogout }) {
  return (
    <RiderDashboard
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        try {
          const userRef = doc(
            db,
            'users',
            currentUser.uid
          );

          let userSnap = await getDoc(userRef);

          const isGoogleUser =
            currentUser.providerData.some(
              (p) => p.providerId === 'google.com'
            );

          if (!userSnap.exists() && isGoogleUser) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              role: 'rider',
              createdAt: serverTimestamp(),
            });

            userSnap = await getDoc(userRef);
          }

          const userRole = userSnap.exists()
            ? userSnap.data().role
            : null;

          if (
            userRole !== 'admin' &&
            userRole !== 'rider'
          ) {
            await signOut(auth);

            setUser(null);
            setRole(null);

            return;
          }

          setUser(currentUser);
          setRole(userRole);
        } catch (error) {
          console.error(
            'Unable to load user role:',
            error
          );

          await signOut(auth);

          setUser(null);
          setRole(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  async function handleLogin(email, password) {
    setAuthError('');

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message);
      throw error;
    }
  }

  async function handleGoogleLogin() {
    setAuthError('');

    try {
      await signInWithPopup(
        auth,
        googleProvider
      );
    } catch (error) {
      console.error(
        'Google login error:',
        error
      );

      setAuthError(error.message);
      throw error;
    }
  }

  async function handleSignup({
    name,
    email,
    password,
    role,
  }) {
    setAuthError('');

    try {
      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await updateProfile(
        credential.user,
        {
          displayName: name.trim(),
        }
      );

      await setDoc(
        doc(
          db,
          'users',
          credential.user.uid
        ),
        {
          uid: credential.user.uid,
          name: name.trim(),
          email:
            credential.user.email ||
            email.trim(),
          role,
          createdAt: serverTimestamp(),
        }
      );

      setUser(credential.user);
      setRole(role);
    } catch (error) {
      console.error(
        'Signup error:',
        error
      );

      setAuthError(error.message);
      throw error;
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        'Logout error:',
        error
      );
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={role === 'admin' ? '/admin' : '/rider-dashboard'}
                replace
              />
            ) : (
              <Landing />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              role === 'admin' ? (
                <Navigate
                  to="/admin"
                  replace
                />
              ) : (
                <Navigate
                  to="/rider-dashboard"
                  replace
                />
              )
            ) : (
              <LoginPage
                handleLogin={handleLogin}
                handleGoogleLogin={
                  handleGoogleLogin
                }
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate
                to="/rider-dashboard"
                replace
              />
            ) : (
              <SignupPage
                handleSignup={
                  handleSignup
                }
              />
            )
          }
        />

        <Route
          path="/rider-dashboard"
          element={
            <ProtectedRoute
              user={user}
              role={role}
              allowedRoles={['rider']}
            >
              <RiderPage
                handleLogout={
                  handleLogout
                }
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              user={user}
              role={role}
              allowedRoles={['admin']}
            >
              <AdminPage
                user={user}
                handleLogout={
                  handleLogout
                }
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}