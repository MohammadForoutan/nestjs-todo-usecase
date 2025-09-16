import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs(
  'database',
  (): {
    uri: string;
    options: MongooseModuleOptions;
  } => ({
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/example',
    options: {
      // Connection Pool Settings
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE ?? '10', 10),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE ?? '2', 10),
      maxIdleTimeMS: parseInt(
        process.env.MONGODB_MAX_IDLE_TIME_MS ?? '30000',
        10,
      ),

      // Connection Timeouts
      serverSelectionTimeoutMS: parseInt(
        process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS ?? '5000',
        10,
      ),
      connectTimeoutMS: parseInt(
        process.env.MONGODB_CONNECT_TIMEOUT_MS ?? '10000',
        10,
      ),
      socketTimeoutMS: parseInt(
        process.env.MONGODB_SOCKET_TIMEOUT_MS ?? '45000',
        10,
      ),

      // Retry Settings
      retryWrites: true,
      retryReads: true,

      // Heartbeat Settings
      heartbeatFrequencyMS: parseInt(
        process.env.MONGODB_HEARTBEAT_FREQUENCY_MS ?? '10000',
        10,
      ),

      // Write Concern
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 5000,
      },

      // Read Preference
      readPreference: 'primary',

      // Compression
      compressors: ['zlib'],
    },
  }),
);
