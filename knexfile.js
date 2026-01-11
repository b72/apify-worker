const Config = require('./src/config');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: Config.db.host,
      port: Config.db.port,
      user: Config.db.user,
      password: Config.db.password,
      database: Config.db.database,
      charset: 'utf8mb4',
    },
    migrations: {
      directory: './migrations',
      extension: 'js',
      loadExtensions: ['.js'],
    },
    seeds: {
      directory: './seeds',
      extension: 'js',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: Config.db.host,
      port: Config.db.port,
      user: Config.db.user,
      password: Config.db.password,
      database: Config.db.database,
      charset: 'utf8mb4',
    },
    migrations: {
      directory: './migrations',
      extension: 'js',
    },
    seeds: {
      directory: './seeds',
      extension: 'js',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  test: {
    client: 'mysql2',
    connection: {
      host: Config.db.host,
      port: Config.db.port,
      user: Config.db.user,
      password: Config.db.password,
      database: Config.db.database,
      charset: 'utf8mb4',
    },
    migrations: {
      directory: './migrations',
      extension: 'js',
    },
  },
};
