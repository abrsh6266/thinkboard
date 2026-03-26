"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Zap, Users } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Layers className="text-white" size={18} />
          </div>
          <span className="text-lg font-bold text-gray-900">ThinkBoard</span>
        </div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap size={14} /> Real-time collaborative thinking
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Think together.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Build better ideas.
            </span>
          </h1>
          <p className="text-lg text-gray-500 mt-6 max-w-xl mx-auto leading-relaxed">
            A collaborative whiteboard where ideas, decisions, and tasks live in
            structured logic layers. Drag, connect, and collaborate — all in
            real time.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link href="/register">
              <Button size="lg">
                Start for free <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24"
        >
          {[
            {
              icon: Layers,
              title: "Logic Layers",
              desc: "Organize thoughts into Ideas, Decisions, and Tasks",
              color: "bg-blue-500",
            },
            {
              icon: Users,
              title: "Real-time Collab",
              desc: "See changes instantly from your entire team",
              color: "bg-purple-500",
            },
            {
              icon: Zap,
              title: "Visual Thinking",
              desc: "Drag, connect, and map relationships visually",
              color: "bg-emerald-500",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
              >
                <f.icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
