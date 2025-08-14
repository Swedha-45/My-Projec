import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  Fade,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  GlobalStyles,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/history/");
        setHistory(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
        {/* App Bar */}
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
            <HistoryIcon sx={{ ml: 2, mr: 1, color: "#ffffff" }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: "#ffffff",
                flexGrow: 1,
              }}
            >
              Generation History
            </Typography>
          </Toolbar>
        </AppBar>

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
              Navigation
            </Typography>
          </Box>
          <List sx={{ pt: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/home"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#2a2a2a",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#6366f1", minWidth: 40 }}>
                  <ArrowBackIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Back to Generator" 
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
                onClick={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
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
            maxWidth="xl" 
            sx={{ 
              py: 4,
              px: { xs: 2, sm: 3, md: 4 },
              minHeight: "calc(100vh - 64px)",
            }}
          >
            {loading ? (
              <Box 
                sx={{ 
                  textAlign: "center", 
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "50vh",
                }}
              >
                <CircularProgress 
                  size={60}
                  sx={{ 
                    color: "#6366f1",
                    mb: 3,
                  }} 
                />
                <Typography 
                  variant="h6"
                  sx={{ 
                    color: "#9ca3af",
                    fontWeight: 500,
                  }}
                >
                  Loading your creative history...
                </Typography>
              </Box>
            ) : error ? (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    backgroundColor: "#2d1515",
                    border: "1px solid #dc2626",
                    color: "#ffffff",
                    borderRadius: 3,
                    "& .MuiAlert-icon": {
                      color: "#f87171",
                    },
                    maxWidth: 600,
                    mx: "auto",
                    mt: 4,
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {error}
                  </Typography>
                </Alert>
              </Fade>
            ) : history.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: "center", 
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "50vh",
                }}
              >
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #6366f1, #ec4899)",
                    borderRadius: "50%",
                    p: 3,
                    mb: 3,
                    display: "inline-flex",
                    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 48, color: "#ffffff" }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: "#ffffff",
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  No History Yet
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: "#9ca3af",
                    maxWidth: 500,
                    lineHeight: 1.6,
                  }}
                >
                  Start creating amazing images with our AI generator to see them appear here!
                </Typography>
              </Box>
            ) : (
              <>
                {/* Header for history */}
                <Box sx={{ mb: 4, textAlign: "center" }}>
                  <Typography 
                    variant="h3" 
                    fontWeight="800" 
                    sx={{ 
                      color: "#ffffff",
                      mb: 1,
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    Your Creations
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "#9ca3af",
                      mb: 3,
                    }}
                  >
                    {history.length} image{history.length !== 1 ? 's' : ''} generated
                  </Typography>
                </Box>

                {/* History Grid */}
                <Grid container spacing={4}>
                  {history.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                      <Fade in timeout={500 + index * 100}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 4,
                            overflow: "hidden",
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                              borderColor: "#6366f1",
                            },
                            color: "#ffffff",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              overflow: "hidden",
                              backgroundColor: "#0f0f0f",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={item.generated_image}
                              alt="Generated artwork"
                              sx={{
                                height: 280,
                                objectFit: "contain",
                                transition: "transform 0.3s ease",
                                "&:hover": { 
                                  transform: "scale(1.05)",
                                },
                              }}
                            />
                          </Box>
                          <CardContent sx={{ p: 3, flexGrow: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#e5e7eb",
                                fontStyle: "italic",
                                mb: 2,
                                lineHeight: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              "{item.prompt}"
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: "auto",
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: "#9ca3af",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {new Date(item.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default History;