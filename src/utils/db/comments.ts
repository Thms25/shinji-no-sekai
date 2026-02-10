import { getDbInstance } from './client'
import type { Comment } from '../type-utils'

export async function getCommentsByTrackId(
  trackId: string,
): Promise<Comment[]> {
  try {
    const db = await getDbInstance()
    if (!db) return []

    const commentsDocs = await db
      .collection('comments')
      .find({
        trackId,
      })
      .sort({ createdAt: -1 })
      .toArray()

    const comments = commentsDocs.map(
      doc =>
        ({
          id: doc._id.toString(),
          text: doc.text,
          userId: doc.userId,
          userName: doc.userName,
          userRole: doc.userRole,
          createdAt: doc.createdAt?.toString() || '',
          solved: doc.solved,
          timestamp: doc.timestamp,
          versionId: doc.versionId,
        }) as Comment,
    )

    return comments
  } catch (error) {
    console.error('Error fetching comments by track id:', error)
    return []
  }
}

