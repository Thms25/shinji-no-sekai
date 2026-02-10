'use server'

import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'
import { Reply } from '@/utils/type-utils'
import { getDb } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

export async function solveComment(
  commentId: string,
  trackId: string,
  solved: boolean,
) {
  try {
    const db = await getDb(DB_NAME)
    const comments = db.collection('comments')

    await comments.updateOne(
      { _id: new ObjectId(commentId), trackId },
      { $set: { solved } },
    )

    revalidatePath(`/dashboard/track/${trackId}`)
    return { success: true }
  } catch (e: any) {
    console.error('solveComment error:', e)
    return { error: e.message || 'Failed to update comment.' }
  }
}

export async function deleteComment(commentId: string, trackId: string) {
  try {
    const db = await getDb(DB_NAME)
    const comments = db.collection('comments')
    const replies = db.collection('replies')

    await comments.deleteOne({ _id: new ObjectId(commentId), trackId })
    await replies.deleteMany({ commentId })

    revalidatePath(`/dashboard/track/${trackId}`)
    return { success: true }
  } catch (e: any) {
    console.error('deleteComment error:', e)
    return { error: e.message || 'Failed to delete comment.' }
  }
}

export async function addReply(
  trackId: string,
  commentId: string,
  text: string,
  userId: string,
  userName: string,
  userRole: string,
) {
  try {
    const db = await getDb(DB_NAME)
    const replies = db.collection('replies')

    const reply = {
      trackId,
      commentId,
      text,
      userId,
      userName,
      userRole,
      createdAt: new Date().toISOString(),
    }

    await replies.insertOne(reply)

    revalidatePath(`/dashboard/track/${trackId}`)
    return { success: true }
  } catch (e: any) {
    console.error('addReply error:', e)
    return { error: e.message || 'Failed to add reply.' }
  }
}

export async function getReplies(trackId: string, commentId: string) {
  try {
    const db = await getDb(DB_NAME)
    const repliesCol = db.collection('replies')

    const docs = await repliesCol
      .find({ trackId, commentId })
      .sort({ createdAt: 1 })
      .toArray()

    const replies = docs.map(
      (doc) =>
        ({
          id: doc._id.toString(),
          text: doc.text,
          userId: doc.userId,
          userName: doc.userName,
          userRole: doc.userRole,
          createdAt: doc.createdAt,
        }) as Reply,
    )

    return { replies }
  } catch (e: any) {
    console.error('getReplies error:', e)
    return { error: e.message || 'Failed to get replies.' }
  }
}

