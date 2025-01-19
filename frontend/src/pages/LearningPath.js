import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';

const LEARNING_PATH_QUERY = gql`
  query LearningPath($id: ID!) {
    learningPath(id: $id) {
      id
      title
      description
      difficulty
      estimatedHours
      creator {
        id
        username
      }
      steps {
        id
        title
        content
        order
        completionCriteria
        resources {
          id
          title
          type
          url
          description
        }
      }
    }
  }
`;

const LearningPath = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const { loading, error, data } = useQuery(LEARNING_PATH_QUERY, {
    variables: { id },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error loading learning path: {error.message}</Typography>
      </Box>
    );
  }

  const { learningPath } = data;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {learningPath.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {learningPath.description}
            </Typography>
          </Box>
          <Chip
            icon={<SchoolIcon />}
            label={learningPath.difficulty}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Chip
            icon={<TimerIcon />}
            label={`${learningPath.estimatedHours} hours`}
            variant="outlined"
          />
          <Chip
            icon={<PersonIcon />}
            label={`Created by ${learningPath.creator.username}`}
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Progress Tracker */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Progress Tracker
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress
              variant="determinate"
              value={(activeStep / learningPath.steps.length) * 100}
              size={60}
            />
            <Typography variant="body1">
              {Math.round((activeStep / learningPath.steps.length) * 100)}% Complete
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Learning Steps */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {learningPath.steps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel>
                <Typography variant="h6">{step.title}</Typography>
              </StepLabel>
              <StepContent>
                <Typography paragraph>{step.content}</Typography>

                {/* Resources */}
                {step.resources.length > 0 && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Resources
                    </Typography>
                    <List>
                      {step.resources.map((resource) => (
                        <ListItem key={resource.id}>
                          <ListItemIcon>
                            <PlayArrowIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                              >
                                {resource.title}
                              </Link>
                            }
                            secondary={resource.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Completion Criteria */}
                {step.completionCriteria && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Completion Criteria
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.completionCriteria}
                    </Typography>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === learningPath.steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === learningPath.steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset Progress
            </Button>
          </Paper>
        )}
      </Paper>

      {/* Progress Indicators */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {learningPath.steps.map((_, index) => (
          <Chip
            key={index}
            icon={index <= activeStep ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
            label={`Step ${index + 1}`}
            color={index <= activeStep ? 'success' : 'default'}
            variant={index === activeStep ? 'filled' : 'outlined'}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LearningPath;
