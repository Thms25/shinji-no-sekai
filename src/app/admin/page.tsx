import CreateArtistModal from "@/components/admin/CreateArtistModal";
import ArtistList from "@/components/admin/ArtistList";
import { listArtistsForAdmin } from "@/utils/db/artists";

// Force dynamic rendering since we are fetching data that changes
export const dynamic = "force-dynamic";

async function getArtists() {
  try {
    return await listArtistsForAdmin();
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
