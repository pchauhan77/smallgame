import Mongoose from 'mongoose';

Mongoose.Promise = global.Promise;

 const connectToMongoDb = async () => {
  Mongoose.connect('mongodb://localhost/gametest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
 };

export default connectToMongoDb;