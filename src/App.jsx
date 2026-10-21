
import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Display from "./components/Display.jsx";
import RiderDashboard from "./pages/RiderDashboard.jsx";

import { auth, googleProvider, db } from "./firebase.js";

function ProtectedRoute({ user, role, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "rider") {
      return <Navigate to="/rider-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

function LoginPage({ handleLogin, handleGoogleLogin }) {
  const navigate = useNavigate();

  return (
    <Login
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignup={() => navigate("/signup")}
    />
  );
}

function SignupPage({ handleSignup }) {
  const navigate = useNavigate();

  return (
    <Signup
      onSignup={handleSignup}
      onBackToLogin={() => navigate("/login")}
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

function RiderPage({ user, handleLogout }) {
  return (
    <RiderDashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          if (active) {
            setUser(null);
            setRole(null);
            setLoading(false);
          }
          return;
        }

        if (active) {
          setLoading(true);
        }

        try {
          const userRef = doc(db, "users", currentUser.uid);
          let userSnap = await getDoc(userRef);

          const isGoogleUser = currentUser.providerData.some(
            (provider) => provider.providerId === "google.com"
          );

          // Bagong Google user: gumawa ng rider account.
          // Huwag baguhin ang role ng existing user.
          if (!userSnap.exists() && isGoogleUser) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              name: currentUser.displayName || "",
              email: currentUser.email || "",
              role: "rider",
              createdAt: serverTimestamp(),
            });

            userSnap = await getDoc(userRef);
          }

          const userData = userSnap.exists()
            ? userSnap.data()
            : null;

          const userRole = userData?.role ?? null;

          console.log("Logged-in UID:", currentUser.uid);
          console.log("Firestore document exists:", userSnap.exists());
          console.log("Firestore user data:", userData);
          console.log("Firestore role:", userRole);

          if (userRole !== "admin" && userRole !== "rider") {
            throw new Error(
              "Walang valid role ang account. Tingnan ang users/" +
                currentUser.uid +
                " sa Firestore."
            );
          }

          if (active) {
            setUser(currentUser);
            setRole(userRole);
            setAuthError("");
          }
        } catch (error) {
          console.error("Unable to load user role:", error);

          if (active) {
            setUser(null);
            setRole(null);
            setAuthError(
              error.message || "Hindi ma-load ang user role."
            );
          }

          try {
            await signOut(auth);
          } catch (signOutError) {
            console.error("Sign-out error:", signOutError);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function handleLogin(email, password) {
    setAuthError("");

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      setAuthError(error.message || "Unable to log in.");
      throw error;
    }
  }

  async function handleGoogleLogin() {
    setAuthError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);

      console.log(
        "Google authentication successful:",
        result.user.uid
      );

      // Ang onAuthStateChanged ang magbabasa ng Firestore role
      // at mag-a-update ng user at role state.
    } catch (error) {
      console.error(
        "Google login error:",
        error.code,
        error.message
      );

      setAuthError(error.message || "Unable to sign in with Google.");
      throw error;
    }
  }

  async function handleSignup({ name, email, password }) {
    setAuthError("");

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(credential.user, {
        displayName: name.trim(),
      });

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: name.trim(),
        email: credential.user.email || email.trim(),
        role: "rider",
        createdAt: serverTimestamp(),
      });

      setUser(credential.user);
      setRole("rider");
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      setAuthError(error.message || "Unable to sign up.");
      throw error;
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      setAuthError("");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {authError && (
        <div
          className="alert alert-danger m-3"
          role="alert"
        >
          {authError}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  role === "admin"
                    ? "/admin"
                    : "/rider-dashboard"
                }
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
              <Navigate
                to={
                  role === "admin"
                    ? "/admin"
                    : "/rider-dashboard"
                }
                replace
              />
            ) : (
              <LoginPage
                handleLogin={handleLogin}
                handleGoogleLogin={handleGoogleLogin}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate
                to={
                  role === "admin"
                    ? "/admin"
                    : "/rider-dashboard"
                }
                replace
              />
            ) : (
              <SignupPage handleSignup={handleSignup} />
            )
          }
        />

        <Route
          path="/rider-dashboard"
          element={
            <ProtectedRoute
              user={user}
              role={role}
              allowedRoles={["rider"]}
            >
              <RiderPage
                user={user}
                handleLogout={handleLogout}
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
              allowedRoles={["admin"]}
            >
              <AdminPage
                user={user}
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
