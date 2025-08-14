import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
  Login as LoginIcon,
  PersonAdd,
} from "@mui/icons-material";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

// Enhanced Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f0f0f',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function Form({ route, method }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const isLogin = method === "login";
  const isRegister = method === "register";

  const validateForm = () => {
    const newErrors = {};

    if (isRegister && !formData.email) {
      newErrors.email = "Email is required";
    } else if (isRegister && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await api.post(route, payload);

      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/home");
      } else if (isRegister) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid credentials or something went wrong.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      {/* Animated Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)
          `,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 40%)
            `,
            animation: 'float 20s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '33%': { transform: 'translateY(-20px) rotate(1deg)' },
            '66%': { transform: 'translateY(10px) rotate(-1deg)' },
          },
        }}
      />

      <Container 
        component="main"
        maxWidth="xs"
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: "100vh",
          minWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                borderRadius: 3,
                background: `
                  linear-gradient(145deg, 
                    rgba(26, 26, 26, 0.9) 0%, 
                    rgba(30, 30, 30, 0.9) 50%,
                    rgba(26, 26, 26, 0.9) 100%
                  )
                `,
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.05),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Header */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    style={{
                      background: isLogin 
                        ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                        : 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                      borderRadius: "50%",
                      padding: "16px",
                      display: "inline-flex",
                      marginBottom: "20px",
                      boxShadow: `
                        0 8px 20px ${isLogin ? 'rgba(99, 102, 241, 0.3)' : 'rgba(236, 72, 153, 0.3)'},
                        0 0 0 1px rgba(255, 255, 255, 0.1)
                      `,
                    }}
                  >
                    {isLogin ? (
                      <LoginIcon sx={{ fontSize: 32, color: "white" }} />
                    ) : (
                      <PersonAdd sx={{ fontSize: 32, color: "white" }} />
                    )}
                  </motion.div>
                  <Typography 
                    component="h1" 
                    variant="h4" 
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1.1rem',
                    }}
                  >
                    {isLogin
                      ? "Sign in to your account"
                      : "Fill in your details to get started"}
                  </Typography>
                </Box>
              </motion.div>

              <Divider 
                sx={{ 
                  width: "100%", 
                  mb: 3,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                  height: '1px',
                  border: 'none',
                }} 
              />

              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    severity="error"
                    sx={{ 
                      width: "100%", 
                      mb: 2,
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#ef4444',
                      },
                      '& .MuiAlert-message': {
                        color: '#ffffff',
                      },
                    }}
                    onClose={() => setApiError("")}
                  >
                    {apiError}
                  </Alert>
                </motion.div>
              )}

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                style={{ width: "100%" }}
              >
                {isRegister && (
                  <motion.div variants={fadeUp}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  </motion.div>
                )}

                <motion.div variants={fadeUp}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus={isLogin}
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      mt: 1,
                      mb: 2,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      background: isLogin
                        ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                        : "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
                      boxShadow: `
                        0 4px 20px ${isLogin ? 'rgba(99, 102, 241, 0.4)' : 'rgba(236, 72, 153, 0.4)'},
                        0 0 0 1px rgba(255, 255, 255, 0.1)
                      `,
                      "&:hover": {
                        background: isLogin
                          ? "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)"
                          : "linear-gradient(135deg, #db2777 0%, #ea580c 100%)",
                        transform: 'translateY(-2px)',
                        boxShadow: `
                          0 8px 25px ${isLogin ? 'rgba(99, 102, 241, 0.5)' : 'rgba(236, 72, 153, 0.5)'},
                          0 0 0 1px rgba(255, 255, 255, 0.2)
                        `,
                      },
                      "&:disabled": {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        {isLogin ? (
                          <LoginIcon sx={{ mr: 1 }} />
                        ) : (
                          <PersonAdd sx={{ mr: 1 }} />
                        )}
                        {isLogin ? "Sign In" : "Create Account"}
                      </>
                    )}
                  </Button>

                  <motion.div variants={fadeUp}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2, 
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      {isLogin ? (
                        <Link 
                          to="/" 
                          style={{ 
                            color: '#818cf8',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          No account yet? Please register!
                        </Link>
                      ) : (
                        <Link 
                          to="/login" 
                          style={{ 
                            color: '#f472b6',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Already have an account? Login here
                        </Link>
                      )}
                    </Typography>
                  </motion.div>
                </motion.div>
              </motion.div>
            </Paper>
          </Box>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}

export default Form;