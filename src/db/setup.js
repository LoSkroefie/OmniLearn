const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 0,
        role VARCHAR(50) DEFAULT 'USER',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user_badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        user_id INTEGER REFERENCES users(id),
        badge_id INTEGER REFERENCES badges(id),
        awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, badge_id)
      );
    `);

    // Create articles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        tags TEXT[],
        author_id INTEGER REFERENCES users(id),
        version INTEGER DEFAULT 1,
        verification_status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create article_contributors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS article_contributors (
        article_id INTEGER REFERENCES articles(id),
        user_id INTEGER REFERENCES users(id),
        contributed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (article_id, user_id)
      );
    `);

    // Create sources table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sources (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id),
        url VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        author VARCHAR(255),
        published_date TIMESTAMP WITH TIME ZONE,
        verification_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create learning_paths table
    await client.query(`
      CREATE TABLE IF NOT EXISTS learning_paths (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty VARCHAR(50) NOT NULL,
        estimated_hours INTEGER,
        creator_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create learning_steps table
    await client.query(`
      CREATE TABLE IF NOT EXISTS learning_steps (
        id SERIAL PRIMARY KEY,
        learning_path_id INTEGER REFERENCES learning_paths(id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        completion_criteria TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create resources table
    await client.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        step_id INTEGER REFERENCES learning_steps(id),
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        url VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create knowledge_nodes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_nodes (
        id SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        weight FLOAT DEFAULT 1.0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create knowledge_edges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_edges (
        source_id INTEGER REFERENCES knowledge_nodes(id),
        target_id INTEGER REFERENCES knowledge_nodes(id),
        type VARCHAR(50) NOT NULL,
        weight FLOAT DEFAULT 1.0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (source_id, target_id)
      );
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  setupDatabase,
};
