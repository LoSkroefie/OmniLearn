import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Button,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const SourceEditor = ({ sources, onChange }) => {
  const handleAddSource = () => {
    onChange([
      ...sources,
      {
        url: '',
        title: '',
        author: '',
        publishedDate: '',
      },
    ]);
  };

  const handleRemoveSource = (index) => {
    const newSources = sources.filter((_, i) => i !== index);
    onChange(newSources);
  };

  const handleSourceChange = (index, field, value) => {
    const newSources = sources.map((source, i) => {
      if (i === index) {
        return { ...source, [field]: value };
      }
      return source;
    });
    onChange(newSources);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Sources
      </Typography>

      {sources.map((source, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{ p: 2, mb: 2, position: 'relative' }}
        >
          <IconButton
            size="small"
            color="error"
            onClick={() => handleRemoveSource(index)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <DeleteIcon />
          </IconButton>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
            <TextField
              label="URL"
              value={source.url}
              onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Title"
              value={source.title}
              onChange={(e) => handleSourceChange(index, 'title', e.target.value)}
              fullWidth
            />

            <TextField
              label="Author"
              value={source.author}
              onChange={(e) => handleSourceChange(index, 'author', e.target.value)}
              fullWidth
            />

            <TextField
              label="Published Date"
              type="date"
              value={source.publishedDate}
              onChange={(e) => handleSourceChange(index, 'publishedDate', e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddSource}
        variant="outlined"
        sx={{ mt: 1 }}
      >
        Add Source
      </Button>
    </Box>
  );
};

export default SourceEditor;
