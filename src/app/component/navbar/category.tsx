"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories } from "@/src/app/lib/api";
import {Spinner} from "@heroui/react";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const categoryNames: Record<string, string> = {
  chal: "Rice",
  dal: "Lentils",
  tel: "Oil",
  sobji: "Vegetables",
  mach: "Fish",
};

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
  return (
    <div className="flex justify-center items-center gap-8 text-center py-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner color="current" />
         
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="accent" />
        
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="success" />
       
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="warning" />
        
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="danger" />
       
      </div>
    </div>
  );
}

  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 border-b bg-white px-4 py-3">
      <Link
        href="/"
        className={`font-medium ${
          pathname === "/" ? "text-green-700" : "text-gray-600"
        }`}
      >
        All Products
      </Link>

      {categories.map((category) => {
        const isActive = pathname === `/category/${category.slug}`;

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={`flex items-center gap-2 font-medium transition-colors ${
              isActive
                ? "text-green-700"
                : "text-gray-600 hover:text-green-700"
            }`}
          >
            <span>{category.icon}</span>
            <span>
              {categoryNames[category.slug] ||
                category.slug.charAt(0).toUpperCase() +
                  category.slug.slice(1)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
