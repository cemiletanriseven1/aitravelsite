"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function SaveButton({ route, userId }: { route: any, userId?: string }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      alert("Lütfen önce giriş yapın!");
      return;
    }

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        body: JSON.stringify({ userId, routeData: route }),
      });
      const data = await res.json();
      if (data.action === "saved") setIsSaved(true);
      else setIsSaved(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button 
      onClick={handleSave}
      className={`p-3 rounded-full transition-all ${
        isSaved ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      <Heart size={20} fill={isSaved ? "white" : "none"} />
    </button>
  );
}