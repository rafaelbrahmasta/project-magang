export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Portal Fakultas Ekonomi dan Bisnis
        </h1>
        <p className="text-gray-600 mb-6">
          Universitas Pignatelli Tripura
        </p>
        <div className="p-4 bg-white shadow-md rounded-lg inline-block">
          <span className="text-green-600 font-semibold">● Backend Status: </span>
          <span className="text-gray-700">Terhubung ke Port 5001 (Ngrok Aktif)</span>
        </div>
      </div>
    </main>
  );
}