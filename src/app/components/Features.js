import {
  Truck,
  BadgeDollarSign,
  BadgePercent,
  Headset,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "Orders from all items",
  },
  {
    icon: BadgeDollarSign,
    title: "Return & Refund",
    desc: "Money back guarantee",
  },
  {
    icon: BadgePercent,
    title: "Member Discount",
    desc: "On order over $99",
  },
  {
    icon: Headset,
    title: "Support 24/7",
    desc: "Contact us 24 hours a day",
  },
];

export default function Features() {
  return (
   <section className="py-5 bg-white dark:bg-slate-800">
  <div className="grid grid-cols-4 gap-3 px-5">

        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-4 bg-gray-100 dark:bg-slate-600 px-6 py-7"
            >
              <Icon
                size={38}
                className="text-black dark:text-white flex-shrink-0"
              />

              <div>
                <h3 className="text-xl font-medium text-black dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-lg text-gray-600 dark:text-gray-200">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}