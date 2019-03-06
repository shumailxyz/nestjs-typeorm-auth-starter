module.exports =
  {
    "type": "postgres",
    "host": "localhost",
    "port": process.env.NODE_ENV === "test" ? process.env.TEST_DB_PORT : process.env.DB_PORT,
    "username": "postgres",
    "password": "postgrespassword",
    "database": "v2xdevnest",
    "synchronize": true,
    // "logging": false,
    // "dropSchema": process.env.NODE_ENV === "test" ? true : false,
    "entities": ["src/**/**.entity{.ts,.js}"],
  }

