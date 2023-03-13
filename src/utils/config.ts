const { JWT_SECRET_KEY, MONGO_URI } = process.env;

const config = () => {
  if (!JWT_SECRET_KEY || !MONGO_URI) {
    throw new Error("Some environment variables aren't set");
  }
};
export const keys = {
  JWT_SECRET_KEY: JWT_SECRET_KEY || "",
  MONGO_URI: MONGO_URI || "",
};

export default config;
