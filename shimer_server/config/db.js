import { connect } from 'mongoose';

const connectDb = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (err) {
		console.error(err.message);
  }
};

export default connectDb;