// design-sync stub for @/utils/actions/comment-actions.
// The real module is a 'use server' action file that imports mongodb, which cannot be
// bundled for the browser. Preview cards render the component's markup and states; the
// submit paths are inert by design. Wired via .design-sync/tsconfig.ds.json paths.

export async function addReply(..._args: unknown[]): Promise<{ success: boolean }> {
  return { success: true }
}

export async function getReplies(..._args: unknown[]): Promise<never[]> {
  return []
}

export async function solveComment(..._args: unknown[]): Promise<{ success: boolean }> {
  return { success: true }
}

export async function deleteComment(..._args: unknown[]): Promise<{ success: boolean }> {
  return { success: true }
}
