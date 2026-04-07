export default function Footer() {
  return (
    <footer className="w-full py-6 border-t border-border bg-background text-center text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4">
        <p>© {new Date().getFullYear()} Shinji No Sekai. All rights reserved.</p>
      </div>
    </footer>
  );
}
