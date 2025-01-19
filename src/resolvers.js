const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AIService = require('./services/ai');

const resolvers = {
  Query: {
    // User queries
    me: (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    user: async (_, { id }, { db }) => {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    },
    users: async (_, { limit = 10, offset = 0 }, { db }) => {
      const result = await db.query(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows;
    },
    leaderboard: async (_, { limit = 10 }, { db }) => {
      const result = await db.query(
        'SELECT * FROM users ORDER BY points DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    },

    // Article queries
    article: async (_, { id }, { db }) => {
      const result = await db.query('SELECT * FROM articles WHERE id = $1', [id]);
      return result.rows[0];
    },
    articles: async (_, { limit = 10, offset = 0, tag, searchTerm }, { db }) => {
      let query = 'SELECT * FROM articles';
      const params = [];
      let paramCount = 1;

      if (tag || searchTerm) {
        query += ' WHERE';
        if (tag) {
          query += ` $${paramCount} = ANY(tags)`;
          params.push(tag);
          paramCount++;
        }
        if (searchTerm) {
          if (tag) query += ' AND';
          query += ` (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
          params.push(`%${searchTerm}%`);
          paramCount++;
        }
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      return result.rows;
    },
    relatedArticles: async (_, { articleId, limit = 5 }, { db }) => {
      const article = await db.query('SELECT tags FROM articles WHERE id = $1', [articleId]);
      if (!article.rows[0]) throw new Error('Article not found');

      const result = await db.query(
        'SELECT * FROM articles WHERE id != $1 AND tags && $2 ORDER BY created_at DESC LIMIT $3',
        [articleId, article.rows[0].tags, limit]
      );
      return result.rows;
    },

    // Learning path queries
    learningPath: async (_, { id }, { db }) => {
      const result = await db.query('SELECT * FROM learning_paths WHERE id = $1', [id]);
      return result.rows[0];
    },
    learningPaths: async (_, { difficulty, searchTerm, limit = 10, offset = 0 }, { db }) => {
      let query = 'SELECT * FROM learning_paths';
      const params = [];
      let paramCount = 1;

      if (difficulty || searchTerm) {
        query += ' WHERE';
        if (difficulty) {
          query += ` difficulty = $${paramCount}`;
          params.push(difficulty);
          paramCount++;
        }
        if (searchTerm) {
          if (difficulty) query += ' AND';
          query += ` (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
          params.push(`%${searchTerm}%`);
          paramCount++;
        }
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      return result.rows;
    },
    recommendedPaths: async (_, __, { user, db }) => {
      if (!user) throw new Error('Not authenticated');

      // Get user's completed paths and interests
      const completedPaths = await db.query(
        'SELECT learning_path_id FROM user_progress WHERE user_id = $1 AND completed = true',
        [user.id]
      );
      const completedIds = completedPaths.rows.map(p => p.learning_path_id);

      // Get recommended paths based on user's level and interests
      const result = await db.query(
        'SELECT * FROM learning_paths WHERE id != ALL($1) ORDER BY created_at DESC LIMIT 5',
        [completedIds]
      );
      return result.rows;
    },

    // Knowledge graph queries
    knowledgeGraph: async (_, { rootTopic, depth = 2 }, { db }) => {
      const nodes = [];
      const edges = [];

      // Recursive function to build graph
      const buildGraph = async (topic, currentDepth) => {
        if (currentDepth > depth) return;

        const nodeResult = await db.query(
          'SELECT * FROM knowledge_nodes WHERE label = $1',
          [topic]
        );
        const node = nodeResult.rows[0];
        if (!node) return;

        nodes.push(node);

        const edgeResult = await db.query(
          'SELECT * FROM knowledge_edges WHERE source_id = $1',
          [node.id]
        );
        for (const edge of edgeResult.rows) {
          edges.push(edge);
          await buildGraph(edge.target_id, currentDepth + 1);
        }
      };

      await buildGraph(rootTopic, 0);
      return { nodes, edges };
    },
    searchNodes: async (_, { term }, { db }) => {
      const result = await db.query(
        'SELECT * FROM knowledge_nodes WHERE label ILIKE $1 LIMIT 10',
        [`%${term}%`]
      );
      return result.rows;
    },
  },

  Mutation: {
    // User mutations
    register: async (_, { username, email, password }, { db }) => {
      const existingUser = await db.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );
      if (existingUser.rows[0]) {
        throw new Error('Username or email already exists');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [username, email, passwordHash]
      );
      const user = result.rows[0];

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return { token, user };
    },
    login: async (_, { email, password }, { db }) => {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) {
        throw new Error('No user found with this email');
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return { token, user };
    },

    // Article mutations
    createArticle: async (_, { title, content, tags, sources }, { user, db }) => {
      if (!user) throw new Error('Not authenticated');

      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        // Generate AI summary
        const summary = await AIService.generateSummary(content);

        // Create article
        const articleResult = await client.query(
          'INSERT INTO articles (title, content, summary, tags, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [title, content, summary, tags, user.id]
        );
        const article = articleResult.rows[0];

        // Add sources
        for (const source of sources) {
          await client.query(
            'INSERT INTO sources (article_id, url, title, author, published_date) VALUES ($1, $2, $3, $4, $5)',
            [article.id, source.url, source.title, source.author, source.publishedDate]
          );
        }

        await client.query('COMMIT');
        return article;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },

    // Learning path mutations
    createLearningPath: async (_, { title, description, difficulty, steps }, { user, db }) => {
      if (!user) throw new Error('Not authenticated');

      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        // Create learning path
        const pathResult = await client.query(
          'INSERT INTO learning_paths (title, description, difficulty, creator_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [title, description, difficulty, user.id]
        );
        const path = pathResult.rows[0];

        // Add steps
        for (const step of steps) {
          const stepResult = await client.query(
            'INSERT INTO learning_steps (learning_path_id, title, content, order_index, completion_criteria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [path.id, step.title, step.content, step.order, step.completionCriteria]
          );

          // Add resources for step
          for (const resource of step.resources) {
            await client.query(
              'INSERT INTO resources (step_id, title, type, url, description) VALUES ($1, $2, $3, $4, $5)',
              [stepResult.rows[0].id, resource.title, resource.type, resource.url, resource.description]
            );
          }
        }

        await client.query('COMMIT');
        return path;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  },

  // Field resolvers
  User: {
    badges: async (user, _, { db }) => {
      const result = await db.query(
        'SELECT b.* FROM badges b JOIN user_badges ub ON b.id = ub.badge_id WHERE ub.user_id = $1',
        [user.id]
      );
      return result.rows;
    },
  },

  Article: {
    author: async (article, _, { db }) => {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [article.author_id]);
      return result.rows[0];
    },
    contributors: async (article, _, { db }) => {
      const result = await db.query(
        'SELECT u.* FROM users u JOIN article_contributors ac ON u.id = ac.user_id WHERE ac.article_id = $1',
        [article.id]
      );
      return result.rows;
    },
    sources: async (article, _, { db }) => {
      const result = await db.query('SELECT * FROM sources WHERE article_id = $1', [article.id]);
      return result.rows;
    },
  },

  LearningPath: {
    creator: async (path, _, { db }) => {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [path.creator_id]);
      return result.rows[0];
    },
    steps: async (path, _, { db }) => {
      const result = await db.query(
        'SELECT * FROM learning_steps WHERE learning_path_id = $1 ORDER BY order_index',
        [path.id]
      );
      return result.rows;
    },
  },

  LearningStep: {
    resources: async (step, _, { db }) => {
      const result = await db.query('SELECT * FROM resources WHERE step_id = $1', [step.id]);
      return result.rows;
    },
  },
};

module.exports = resolvers;
