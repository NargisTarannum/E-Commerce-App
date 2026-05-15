import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      
      <h1 className="text-5xl font-bold text-blue-600 mb-4">
        E-Commerce Store
      </h1>

      <p className="text-gray-600 mb-8">
        Buy amazing products online
      </p>

      <div className="flex gap-4">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">
            Login
          </button>
        </Link>

        <Link href="/signup">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg">
            Signup
          </button>
        </Link>
      </div>

    </div>
  );
}