import {
  Box, Button, Container, TextField, Typography, CircularProgress,
  AppBar, Toolbar, Paper, Alert, Divider, IconButton, Link as MuiLink,
  Fade, Card, CardContent, CardMedia, Slide, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, GlobalStyles
} from "@mui/material";
import {
  AutoAwesome as AutoAwesomeIcon, Logout as LogoutIcon, History as HistoryIcon,
  ImageSearch as ImageSearchIcon, Send as SendIcon, Menu as MenuIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Home() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Ensure dark theme for entire page
  useEffect(() => {
    document.body.style.backgroundColor = "#0a0a0a";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.backgroundColor = "#0a0a0a";
    
    return () => {
      // Cleanup on unmount
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await api.post("/api/generate-image/", { text });
      setImage(res.data.image_url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  return (
    <>
      {/* Global styles to ensure complete dark theme */}
      <GlobalStyles
        styles={{
          html: {
            backgroundColor: "#0a0a0a !important",
            margin: 0,
            padding: 0,
            minHeight: "100%",
          },
          body: {
            backgroundColor: "#0a0a0a !important",
            margin: 0,
            padding: 0,
            minHeight: "100vh",
            overflow: "auto",
          },
          "#root": {
            backgroundColor: "#0a0a0a !important",
            minHeight: "100vh",
          },
          "*": {
            boxSizing: "border-box",
          },
          "::selection": {
            backgroundColor: "#6366f1",
            color: "#fff",
          },
        }}
      />

      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "#0a0a0a",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          color: "#ffffff",
          margin: 0,
          padding: 0,
          position: "relative",
          overflow: "auto",
        }}
      >
        {/* Navbar */}
        <Slide in direction="down">
          <AppBar
            position="static"
            elevation={0}
            sx={{
              background: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid #333",
            }}
          >
            <Toolbar sx={{ minHeight: "64px !important" }}>
              <IconButton 
                color="inherit" 
                onClick={() => setDrawerOpen(true)}
                sx={{ color: "#ffffff" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  ml: 2, 
                  color: "#ffffff",
                  flexGrow: 1,
                }}
              >
                AI Image Generator
              </Typography>
            </Toolbar>
          </AppBar>
        </Slide>

        {/* Drawer Menu */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { 
              backgroundColor: "#1a1a1a", 
              color: "#ffffff", 
              width: 280,
              borderRight: "1px solid #333",
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #333" }}>
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
              Menu
            </Typography>
          </Box>
          <List sx={{ pt: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/history"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#2a2a2a",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#6366f1", minWidth: 40 }}>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="View History" 
                  sx={{ 
                    "& .MuiListItemText-primary": { 
                      color: "#ffffff",
                      fontWeight: 500,
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#2a2a2a",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#ec4899", minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  sx={{ 
                    "& .MuiListItemText-primary": { 
                      color: "#ffffff",
                      fontWeight: 500,
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ minHeight: "calc(100vh - 64px)", backgroundColor: "#0a0a0a" }}>
          <Container 
            maxWidth="lg" 
            sx={{ 
              py: 4,
              px: { xs: 2, sm: 3, md: 4 },
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <Fade in timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 4,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#ffffff",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, #6366f1, #ec4899)",
                  },
                }}
              >
                {/* Header Section */}
                <Box sx={{ textAlign: "center", mb: 5 }}>
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #6366f1, #ec4899)",
                      borderRadius: "50%",
                      p: 2.5,
                      mb: 3,
                      display: "inline-flex",
                      boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 48, color: "#ffffff" }} />
                  </Box>

                  <Typography 
                    variant="h2" 
                    fontWeight="800" 
                    gutterBottom 
                    sx={{ 
                      color: "#ffffff",
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      background: "linear-gradient(135deg, #ffffff, #e5e7eb)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    AI Image Generator
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{ 
                      color: "#9ca3af", 
                      maxWidth: 700, 
                      mx: "auto",
                      lineHeight: 1.6,
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                    }}
                  >
                    Transform your imagination into stunning visuals with our 
                    cutting-edge AI technology
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4, borderColor: "#333333", opacity: 0.7 }} />

                {/* Form Section */}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ mb: 4 }}
                >
                  <TextField
                    label="Enter your creative prompt"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    placeholder="Describe the image you want to generate in detail..."
                    sx={{
                      mb: 4,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "#0f0f0f",
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          borderColor: "#404040",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#6366f1",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#6366f1",
                          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#ffffff",
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                      },
                      "& .MuiInputLabel-root": {
                        color: "#9ca3af",
                        fontSize: "1.1rem",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#6366f1",
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !text.trim()}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      py: 2.5,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: "none",
                      background: loading 
                        ? "#404040" 
                        : "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                      color: "#ffffff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: loading 
                          ? "#404040"
                          : "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
                        transform: loading ? "none" : "translateY(-2px)",
                        boxShadow: loading 
                          ? "none"
                          : "0 10px 30px rgba(99, 102, 241, 0.4)",
                      },
                      "&:disabled": {
                        background: "#404040",
                        color: "#888888",
                      },
                    }}
                  >
                    {loading ? "Generating Magic..." : "Generate Image"}
                  </Button>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Fade in>
                    <Alert
                      severity="error"
                      onClose={() => setError(null)}
                      sx={{ 
                        mb: 4, 
                        borderRadius: 3,
                        backgroundColor: "#2d1515",
                        border: "1px solid #dc2626",
                        color: "#ffffff",
                        "& .MuiAlert-icon": {
                          color: "#f87171",
                        },
                        "& .MuiIconButton-root": {
                          color: "#f87171",
                        },
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {error}
                      </Typography>
                    </Alert>
                  </Fade>
                )}

                {/* Generated Image Display */}
                {image && (
                  <Fade in timeout={1000}>
                    <Card
                      elevation={0}
                      sx={{ 
                        borderRadius: 4, 
                        overflow: "hidden",
                        backgroundColor: "#0f0f0f",
                        border: "1px solid #2a2a2a",
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{ 
                            textAlign: "center", 
                            color: "#ffffff",
                            fontWeight: 700,
                            mb: 3,
                          }}
                        >
                          🎨 Your Generated Masterpiece
                        </Typography>
                        
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 3,
                            backgroundColor: "#000000",
                            borderRadius: 3,
                            mb: 3,
                          }}
                        >
                          <CardMedia
                            component="img"
                            src={image}
                            alt="Generated artwork"
                            sx={{
                              maxWidth: "100%",
                              maxHeight: "600px",
                              borderRadius: 2,
                              objectFit: "contain",
                              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                            }}
                          />
                        </Box>
                        
                        {text && (
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#9ca3af",
                                fontStyle: "italic",
                                backgroundColor: "#1a1a1a",
                                p: 3,
                                borderRadius: 3,
                                border: "1px solid #333333",
                                lineHeight: 1.6,
                              }}
                            >
                              <strong style={{ color: "#ffffff" }}>Prompt:</strong> "{text}"
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Fade>
                )}
              </Paper>
            </Fade>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default Home;