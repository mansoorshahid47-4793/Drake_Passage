export default function Home() {
  return (
    <div className="p-8 space-y-4">
      <h1>Drake Passage</h1>
      <p className="text-muted">Token check: body text, muted text, and a <a href="#">teal link</a>.</p>
      <div className="flex gap-3">
        <span className="bg-navy text-salt px-3 py-2 rounded-control">navy</span>
        <span className="bg-teal text-white px-3 py-2 rounded-control">teal</span>
        <span className="bg-whatsapp text-navy px-3 py-2 rounded-control">whatsapp</span>
      </div>
    </div>
  );
}
