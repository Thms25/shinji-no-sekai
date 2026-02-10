import CreateArtistModal from "@/components/admin/CreateArtistModal";
import ArtistList from "@/components/admin/ArtistList";
import { getDb } from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME || "Shinji";

// Force dynamic rendering since we are fetching data that changes
export const dynamic = "force-dynamic";

async function getArtists() {
  try {
    const db = await getDb(DB_NAME);
    const users = db.collection("users");

    const docs = await users
      .find<{ displayName?: string; email: string; tracksCount?: number; role?: string }>({
        role: "artist",
      })
      .toArray();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      displayName: doc.displayName,
      email: doc.email,
      tracksCount: doc.tracksCount ?? 0,
      role: doc.role,
    })) as Array<{
      id: string;
      displayName?: string;
      email: string;
      tracksCount?: number;
      role?: string;
    }>;
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
}

export default async function AdminDashboard() {
  const artists = await getArtists();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage artists</p>
        </div>
        
        <div className="flex gap-4">
            <CreateArtistModal />
        </div>
      </div>

      <ArtistList initialArtists={artists} />
    </div>
  );
}
