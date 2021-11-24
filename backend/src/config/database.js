require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const config = {
  dialect: "postgres",
  storage: './__tests__/database.sqlite',
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "",
  logging: process.env.DB_DIALECT === 'sqlite' && false,
  port: 5432,
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
};

module.exports = config;
