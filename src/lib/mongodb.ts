import { MongoClient, GridFSBucket } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is not set in environment variables')
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}

const clientPromise = global._mongoClientPromise as Promise<MongoClient>

export async function getMongoClient() {
  return clientPromise
}

export async function getDb(dbName: string) {
  const client = await getMongoClient()
  return client.db(dbName)
}

// Helper for getting a GridFS bucket for audio files
export async function getAudioBucket(
  dbName: string,
  bucketName = 'audio',
): Promise<GridFSBucket> {
  const client = await getMongoClient()
  const db = client.db(dbName)
  return new GridFSBucket(db, { bucketName })
}
