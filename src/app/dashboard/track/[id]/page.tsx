import { adminDb } from "@/lib/firebase-admin";
import TrackPage from "./page-client"; // Rename the client component

// Force dynamic
export const dynamic = "force-dynamic";

export default async function TrackPageServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch track
  const trackDoc = await adminDb.collection("tracks").doc(id).get();
  if (!trackDoc.exists) {
      return <div>Track not found</div>;
  }
  const track = { id: trackDoc.id, ...trackDoc.data() };

  // Fetch versions
  const versionsSnapshot = await adminDb.collection("tracks").doc(id).collection("versions").orderBy("createdAt", "asc").get();
  const versions = versionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt }));

  // Fetch comments
  const commentsSnapshot = await adminDb.collection("tracks").doc(id).collection("comments").orderBy("createdAt", "desc").get();
  const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return <TrackPage params={params} track={track} versions={versions} comments={comments} />;
}
