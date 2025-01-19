import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, gql } from '@apollo/client';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Autocomplete,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import SourceEditor from '../components/SourceEditor';

const ARTICLE_QUERY = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      title
      content
      tags
      sources {
        url
        title
        author
        publishedDate
      }
    }
  }
`;

const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle(
    $title: String!
    $content: String!
    $tags: [String]!
    $sources: [SourceInput]!
  ) {
    createArticle(
      title: $title
      content: $content
      tags: $tags
      sources: $sources
    ) {
      id
    }
  }
`;

const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticle(
    $id: ID!
    $title: String
    $content: String
    $tags: [String]
    $sources: [SourceInput]
  ) {
    updateArticle(
      id: $id
      title: $title
      content: $content
      tags: $tags
      sources: $sources
    ) {
      id
    }
  }
`;

const DELETE_ARTICLE_MUTATION = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;

const ArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewArticle = !id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [sources, setSources] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const { loading: articleLoading } = useQuery(ARTICLE_QUERY, {
    variables: { id },
    skip: isNewArticle,
    onCompleted: (data) => {
      setTitle(data.article.title);
      setContent(data.article.content);
      setTags(data.article.tags);
      setSources(data.article.sources);
    },
  });

  const [createArticle, { loading: createLoading }] = useMutation(
    CREATE_ARTICLE_MUTATION,
    {
      onCompleted: (data) => {
        navigate(`/article/${data.createArticle.id}`);
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  const [updateArticle, { loading: updateLoading }] = useMutation(
    UPDATE_ARTICLE_MUTATION,
    {
      onCompleted: () => {
        navigate(`/article/${id}`);
      },
      onError: (error) => {
        setError(error.message);
      },
    }
  );

  const [deleteArticle] = useMutation(DELETE_ARTICLE_MUTATION, {
    onCompleted: () => {
      navigate('/');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const variables = {
      title,
      content,
      tags,
      sources,
    };

    try {
      if (isNewArticle) {
        await createArticle({ variables });
      } else {
        await updateArticle({ variables: { id, ...variables } });
      }
    } catch (err) {
      setError('Failed to save article');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle({ variables: { id } });
    } catch (err) {
      setError('Failed to delete article');
    }
    setDeleteDialogOpen(false);
  };

  if (articleLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            {isNewArticle ? 'Create New Article' : 'Edit Article'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={tags}
            onChange={(_, newValue) => setTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags..."
                sx={{ mb: 3 }}
              />
            )}
          />

          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            multiline
            rows={15}
            sx={{ mb: 3 }}
          />

          <SourceEditor
            sources={sources}
            onChange={setSources}
          />

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Save Article'
              )}
            </Button>

            {!isNewArticle && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Article
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Article?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this article? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleEdit;
