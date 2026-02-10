import { Comment } from '@/utils/type-utils'
import { useState } from 'react'
import { Check, Trash, MessageSquare } from 'lucide-react'
import { solveComment, deleteComment } from '@/actions/comment-actions'

export default function CommentList({
  comments,
  trackId,
  userRole,
  onCommentClick,
}: {
  comments: Comment[]
  trackId: string
  userRole: string
  onCommentClick?: (commentId: string) => void
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleSolve = async (
    e: React.MouseEvent,
    id: string,
    currentStatus: boolean,
  ) => {
    e.stopPropagation()
    setLoadingId(id)
    await solveComment(id, trackId, !currentStatus)
    setLoadingId(null)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Delete this comment?')) return
    setLoadingId(id)
    await deleteComment(id, trackId)
    setLoadingId(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {comments.map(comment => (
        <div
          key={comment.id}
          onClick={() => onCommentClick?.(comment.id)}
          className={`p-4 bg-white/5 rounded-lg border transition-colors cursor-pointer group hover:border-white/20
                ${comment.solved ? 'border-green-500/30 bg-green-500/5' : 'border-white/5'}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-primary">
                {comment.userName}
              </span>
              {comment.timestamp && (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                  {formatTime(comment.timestamp)}
                </span>
              )}
            </div>
          </div>

          <p
            className={`text-sm mb-4 leading-relaxed ${comment.solved ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'}`}
          >
            {comment.text}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare size={14} />
              <span>View Thread</span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {(userRole === 'admin' || !comment.solved) && (
                <button
                  onClick={e => handleSolve(e, comment.id, comment.solved)}
                  disabled={loadingId === comment.id}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors ${comment.solved ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'}`}
                  title={comment.solved ? 'Mark Unsolved' : 'Mark Solved'}
                >
                  <Check size={16} />
                </button>
              )}
              {(userRole === 'admin' || comment.userRole === userRole) && (
                <button
                  onClick={e => handleDelete(e, comment.id)}
                  disabled={loadingId === comment.id}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-red-500"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          No comments yet.
        </div>
      )}
    </div>
  )
}
