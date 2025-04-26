"use client";

export default function TestInsertUser() {
  const insertUser = async () => {
    const response = await fetch("/api/insert-user", {
      method: "POST",
    });
    const result = await response.json();
    console.log("📦 Insert User Result:", result);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Test Insert User</h1>
      <button
        onClick={insertUser}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition"
      >
        Insert Test User
      </button>
    </div>
  );
}
