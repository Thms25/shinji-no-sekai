'use server'

import { adminDb } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'
import { Reply } from '@/utils/type-utils'

export async function solveComment(
  commentId: string,
  trackId: string,
  solved: boolean,
) {
  try {
    await adminDb
      .collection('tracks')
      .doc(trackId)
      .collection('comments')
      .doc(commentId)
      .update({
        solved,
      })
    revalidatePath(`/dashboard/track/${trackId}`)
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteComment(commentId: string, trackId: string) {
  try {
    await adminDb
      .collection('tracks')
      .doc(trackId)
      .collection('comments')
      .doc(commentId)
      .delete()
    revalidatePath(`/dashboard/track/${trackId}`)
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
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
    const reply = {
      text,
      userId,
      userName,
      userRole,
      createdAt: new Date().toISOString(),
    }

    await adminDb
      .collection('tracks')
      .doc(trackId)
      .collection('comments')
      .doc(commentId)
      .collection('replies')
      .add(reply)

    revalidatePath(`/dashboard/track/${trackId}`)
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getReplies(trackId: string, commentId: string) {
  try {
    const snapshot = await adminDb
      .collection('tracks')
      .doc(trackId)
      .collection('comments')
      .doc(commentId)
      .collection('replies')
      .orderBy('createdAt', 'asc')
      .get()

    const replies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Reply[]

    return { replies }
  } catch (e: any) {
    return { error: e.message }
  }
}
