import { Comment } from "@/utils/type-utils";
import { useState } from "react";
import { X, Check, Trash } from "lucide-react";
import { solveComment, deleteComment } from "@/actions/comment-actions";

export default function CommentList({ comments, trackId, userRole }: { comments: Comment[], trackId: string, userRole: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSolve = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    await solveComment(id, trackId, !currentStatus);
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    setLoadingId(id);
    await deleteComment(id, trackId);
    setLoadingId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
            <div key={comment.id} className={`p-3 bg-white/5 rounded-lg border ${comment.solved ? "border-green-500/30 bg-green-500/5" : "border-white/5"}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-primary">{comment.userName}</span>
                    {comment.timestamp && (
                        <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                            {formatTime(comment.timestamp)}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {(userRole === 'admin' || !comment.solved) && (
                         <button 
                            onClick={() => handleSolve(comment.id, comment.solved)}
                            disabled={loadingId === comment.id}
                            className={`p-1 rounded hover:bg-white/10 ${comment.solved ? "text-green-500" : "text-muted-foreground hover:text-green-500"}`}
                            title={comment.solved ? "Mark Unsolved" : "Mark Solved"}
                        >
                            <Check size={16} />
                        </button>
                    )}
                    {(userRole === 'admin' || comment.userRole === userRole) && (
                         <button 
                            onClick={() => handleDelete(comment.id)}
                            disabled={loadingId === comment.id}
                            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-red-500"
                            title="Delete"
                        >
                            <Trash size={16} />
                        </button>
                    )}
                </div>
            </div>
            <p className={`text-sm ${comment.solved ? "text-muted-foreground line-through opacity-70" : "text-foreground"}`}>
                {comment.text}
            </p>
            </div>
        ))}
        {comments.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">No comments yet.</div>
        )}
    </div>
  );
}