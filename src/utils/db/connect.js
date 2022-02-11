import Sequelize from "sequelize";

/**
 * 
 * # Structure : 'dialect://user:password@host:port/dbname
    #Example : 'postgres://user:pass@example.com:5432/dbname
 */

const { DATABASE_URL, NODE_ENV } = process.env;

const isServerProduction = NODE_ENV === "production";

const sslOptions = isServerProduction
  ? {
      dialectOptions: {
        // IMPORTANT
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
  : {};

const sequelize = new Sequelize(DATABASE_URL, {
  /**
   * dialect is important , why ?
   * 
    when you deploy your app to heroku
    their dialect postgresql
   */
  dialect: "postgres",

  ...sslOptions,
});

export const authenticateDatabase = async () => {
  try {
    // it's checking if credentials are valid to authenticate
    // sequelize as default logs sql queries, logging:false will prevent that.
    await sequelize.authenticate({ logging: false });
    /**
     * alter:true -> if there is any change apply without dropping tables
     * force:true -> apply changes and drop tables
     */
    await sequelize.sync({ alter: true, logging: false });
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.log(error);
    console.error("❌ Unable to connect to the database:", error);
  }
};

export default sequelize;
