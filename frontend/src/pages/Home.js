import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DASHBOARD_QUERY = gql`
  query Dashboard {
    trendingArticles: articles(limit: 3) {
      id
      title
      summary
      tags
      author {
        username
      }
    }
    recommendedPaths: learningPaths(limit: 3) {
      id
      title
      description
      difficulty
      estimatedHours
      creator {
        username
      }
    }
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error, data } = useQuery(DASHBOARD_QUERY);

  const features = [
    {
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      title: 'Interactive Knowledge Graph',
      description: 'Visualize connections between topics and discover new learning paths.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Personalized Learning',
      description: 'AI-powered recommendations tailored to your interests and goals.',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Collaborative Learning',
      description: 'Join a community of learners and contribute to shared knowledge.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="inherit"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Welcome to OmniLearn
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                The next generation of collaborative learning and knowledge sharing.
                Discover, learn, and contribute to a growing ecosystem of knowledge.
              </Typography>
              {!user && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ mt: 2 }}
                >
                  Get Started
                </Button>
              )}
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why OmniLearn?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Content Sections */}
      <Container maxWidth="lg">
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            Error loading content
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {/* Trending Articles */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingIcon sx={{ mr: 1 }} /> Trending Articles
              </Typography>
              <Grid container spacing={2}>
                {data.trendingArticles.map((article) => (
                  <Grid item xs={12} key={article.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {article.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {article.summary}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {article.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => navigate(`/article/${article.id}`)}
                        >
                          Read More
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Recommended Learning Paths */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1 }} /> Recommended Paths
              </Typography>
              <Grid container spacing={2}>
                {data.recommendedPaths.map((path) => (
                  <Grid item xs={12} key={path.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {path.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {path.description}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={path.difficulty}
                            size="small"
                            color="primary"
                          />
                          <Typography variant="body2" color="text.secondary">
                            {path.estimatedHours} hours
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => navigate(`/learning-path/${path.id}`)}
                        >
                          Start Learning
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          mt: 8,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Join our community and start exploring the knowledge graph today.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/knowledge-graph')}
            >
              Explore Knowledge Graph
            </Button>
            {!user && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
