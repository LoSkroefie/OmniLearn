import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Skeleton,
} from '@mui/material';

const RELATED_ARTICLES_QUERY = gql`
  query RelatedArticles($articleId: ID!, $limit: Int) {
    relatedArticles(articleId: $articleId, limit: $limit) {
      id
      title
      summary
      tags
      author {
        username
      }
    }
  }
`;

const RelatedArticles = ({ articleId }) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(RELATED_ARTICLES_QUERY, {
    variables: { articleId, limit: 3 },
  });

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Related Articles
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return null;
  }

  if (!data.relatedArticles.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Related Articles
      </Typography>
      <Grid container spacing={3}>
        {data.relatedArticles.map((article) => (
          <Grid item xs={12} sm={4} key={article.id}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea
                onClick={() => navigate(`/article/${article.id}`)}
                sx={{ height: '100%' }}
              >
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
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {article.summary}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      By {article.author.username}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedArticles;
