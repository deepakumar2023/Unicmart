"use client";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader"

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay (1 second)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <p>This is the users content area.</p>
    </div>
  );
}
