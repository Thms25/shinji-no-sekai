'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { Comment, Reply } from '@/utils/type-utils'
import { addReply, getReplies } from '@/actions/comment-actions'

interface CommentThreadModalProps {
  trackId: string
  comment: Comment
  onClose: () => void
  userId: string
  userName: string
  userRole: string
}

export default function CommentThreadModal({
  trackId,
  comment,
  onClose,
  userId,
  userName,
  userRole,
}: CommentThreadModalProps) {
  const [replies, setReplies] = useState<Reply[]>([])
  const [newReply, setNewReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchReplies = async () => {
      const res = await getReplies(trackId, comment.id)
      if (res.replies) {
        setReplies(res.replies)
      }
      setFetching(false)
    }
    fetchReplies()
  }, [trackId, comment.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [replies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReply.trim()) return

    setLoading(true)
    const res = await addReply(
      trackId,
      comment.id,
      newReply,
      userId,
      userName,
      userRole,
    )

    if (res.success) {
      // Optimistic update
      const tempReply: Reply = {
        id: 'temp-' + Date.now(),
        text: newReply,
        userId,
        userName,
        userRole,
        createdAt: new Date().toISOString(),
      }
      setReplies([...replies, tempReply])
      setNewReply('')

      // Re-fetch to be sure
      const updatedRes = await getReplies(trackId, comment.id)
      if (updatedRes.replies) {
        setReplies(updatedRes.replies)
      }
    }
    setLoading(false)
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-lg flex flex-col max-h-[80vh] shadow-2xl"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 rounded-t-xl">
          <h3 className="font-semibold text-lg">Thread</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Original Comment */}
        <div className="p-4 bg-white/5 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-primary">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp
                ? `${Math.floor(comment.timestamp / 60)}:${Math.floor(
                    comment.timestamp % 60,
                  )
                    .toString()
                    .padStart(2, '0')} • `
                : ''}
              {formatTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {comment.text}
          </p>
        </div>

        {/* Replies List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] custom-scrollbar"
        >
          {fetching ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No replies yet. Start the conversation!
            </div>
          ) : (
            replies.map(reply => (
              <div key={reply.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/70">
                    {reply.userName}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(reply.createdAt)}
                  </span>
                </div>
                <div className="bg-white/5 rounded-lg rounded-tl-none px-3 py-2 text-sm text-foreground/90 w-fit max-w-[90%]">
                  {reply.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-white/10 bg-white/5 rounded-b-xl"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newReply}
              onChange={e => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newReply.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
