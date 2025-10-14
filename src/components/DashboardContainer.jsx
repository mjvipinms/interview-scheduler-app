export default function DashboardContainer({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl text-primary font-bold mb-4">{title}</h1>
        <div className="bg-white rounded-2xl shadow p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
