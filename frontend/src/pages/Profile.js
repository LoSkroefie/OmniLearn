import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Create as CreateIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const USER_PROFILE_QUERY = gql`
  query UserProfile($id: ID!) {
    user(id: $id) {
      id
      username
      points
      badges {
        id
        name
        description
        imageUrl
      }
      role
    }
  }
`;

const USER_STATS_QUERY = gql`
  query UserStats($userId: ID!) {
    userStats(userId: $userId) {
      articlesCreated
      articlesContributed
      learningPathsCompleted
      totalPoints
      rank
      level
      nextLevelPoints
      progressToNextLevel
    }
  }
`;

const Profile = () => {
  const { id } = useParams();

  const { loading: profileLoading, error: profileError, data: profileData } = useQuery(
    USER_PROFILE_QUERY,
    {
      variables: { id },
    }
  );

  const { loading: statsLoading, error: statsError, data: statsData } = useQuery(
    USER_STATS_QUERY,
    {
      variables: { userId: id },
    }
  );

  if (profileLoading || statsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (profileError || statsError) {
    return (
      <Box p={3}>
        <Typography color="error">
          Error loading profile: {profileError?.message || statsError?.message}
        </Typography>
      </Box>
    );
  }

  const { user } = profileData;
  const stats = statsData.userStats;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Grid container spacing={4}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.role}
            </Typography>
            <Chip
              icon={<TrophyIcon />}
              label={`Level ${stats.level}`}
              color="primary"
              sx={{ mt: 1 }}
            />
          </Paper>

          {/* Progress to Next Level */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Progress to Level {stats.level + 1}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stats.progressToNextLevel}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {stats.nextLevelPoints - stats.totalPoints} points needed
            </Typography>
          </Paper>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Activity Stats */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Activity Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Articles Created
                        </Typography>
                        <Typography variant="h4">
                          {stats.articlesCreated}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Contributions
                        </Typography>
                        <Typography variant="h4">
                          {stats.articlesContributed}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Paths Completed
                        </Typography>
                        <Typography variant="h4">
                          {stats.learningPathsCompleted}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Total Points
                        </Typography>
                        <Typography variant="h4">
                          {stats.totalPoints}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Badges */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Badges & Achievements
                </Typography>
                <Grid container spacing={2}>
                  {user.badges.map((badge) => (
                    <Grid item xs={12} sm={6} md={4} key={badge.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {badge.imageUrl ? (
                              <Avatar src={badge.imageUrl} />
                            ) : (
                              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                <TrophyIcon />
                              </Avatar>
                            )}
                            <Box>
                              <Typography variant="subtitle1">{badge.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {badge.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
