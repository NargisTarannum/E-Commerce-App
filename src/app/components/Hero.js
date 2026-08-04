import Image from "next/image";

export default function Hero() {
  return (
   <section className="bg-slate-200 dark:bg-slate-700">
  <div className="flex flex-col lg:flex-row items-center justify-between px-16 py-16">
        <div className="w-full lg:w-1/2">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Starting At 999dt
          </p>

          <h1 className="text-5xl lg:text-7xl font-bold mt-5 text-black dark:text-white">
            The best notebook
            <br />
            collection 2025
          </h1>

          <p className="text-2xl lg:text-4xl font-semibold mt-6 text-black dark:text-white">
            Exclusive offer
            <span className="text-red-600"> -50%</span> off this week
          </p>

          <button className="mt-10 px-8 py-4 rounded-md bg-white text-black shadow-lg hover:bg-black hover:text-white transition">
            Grab the opportunity Now
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">
          <Image
            src="/hero.png"
            width={650}
            height={500}
            alt="Laptop"
            className="object-contain"
          />
        </div>

      </div>

    </section>
  );
}