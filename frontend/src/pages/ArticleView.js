import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import RelatedArticles from '../components/RelatedArticles';

const ARTICLE_QUERY = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      title
      content
      summary
      tags
      createdAt
      updatedAt
      author {
        id
        username
      }
      contributors {
        id
        username
      }
      sources {
        url
        title
        author
        publishedDate
      }
      verificationStatus
    }
  }
`;

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { loading, error, data } = useQuery(ARTICLE_QUERY, {
    variables: { id },
  });

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
        <Typography color="error">Error loading article: {error.message}</Typography>
      </Box>
    );
  }

  const { article } = data;
  const isAuthor = user?.id === article.author.id;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {article.title}
          </Typography>
          {isAuthor && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/article/edit/${id}`)}
            >
              Edit Article
            </Button>
          )}
        </Box>

        {/* Tags */}
        <Box sx={{ mb: 3 }}>
          {article.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              sx={{ mr: 1, mb: 1 }}
              onClick={() => navigate(`/search?tag=${tag}`)}
            />
          ))}
        </Box>

        {/* Summary */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1">{article.summary}</Typography>
        </Paper>

        {/* Main Content */}
        <Typography variant="body1" component="div" sx={{ mb: 4 }}>
          {article.content}
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* Contributors */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Contributors
          </Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={article.author.username}
                secondary="Author"
              />
            </ListItem>
            {article.contributors.map((contributor) => (
              <ListItem key={contributor.id}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={contributor.username}
                  secondary="Contributor"
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Sources */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Sources
          </Typography>
          <List>
            {article.sources.map((source, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {source.title || source.url}
                    </a>
                  }
                  secondary={`${source.author || 'Unknown author'} • ${
                    new Date(source.publishedDate).toLocaleDateString()
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Metadata */}
        <Box sx={{ mt: 4, color: 'text.secondary' }}>
          <Typography variant="body2">
            Created: {new Date(article.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            Last updated: {new Date(article.updatedAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            Verification Status: {article.verificationStatus}
          </Typography>
        </Box>
      </Paper>

      {/* Related Articles */}
      <RelatedArticles articleId={id} />
    </Box>
  );
};

export default ArticleView;
