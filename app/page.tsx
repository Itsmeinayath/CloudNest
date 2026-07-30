"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Cloud, Lock, Zap, Search, Shield, File as FileIcon, Folder, Image as ImageIcon, FileText, Users, ChevronRight, Play, CheckCircle2, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* Feature Bento Card */
const BentoCard = ({
  icon,
  title,
  description,
  className,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className={`p-8 bg-[#12141a]/60 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-3xl hover:border-[rgba(255,255,255,0.15)] hover:bg-[#12141a]/80 transition-all duration-500 group relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10 h-full flex flex-col">
      <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[rgba(99,102,241,0.15)] to-[rgba(139,92,246,0.15)] text-indigo-400 group-hover:scale-110 transition-transform duration-500 border border-[rgba(99,102,241,0.2)]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-[#8b8fa3] text-sm leading-relaxed mt-auto">{description}</p>
    </div>
  </motion.div>
);

/* Animated Dashboard Mockup */
const DashboardPreview = () => {
  return (
    <div className="w-full aspect-[16/10] bg-[#0b0d12]/90 backdrop-blur-2xl rounded-2xl overflow-hidden flex flex-col border border-[rgba(255,255,255,0.1)] shadow-2xl relative">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

      {/* Window Chrome */}
      <div className="h-12 bg-[#12141a]/80 border-b border-[rgba(255,255,255,0.06)] flex items-center px-5 gap-4 shrink-0 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="h-7 w-64 bg-[#0b0d12] rounded-md border border-[rgba(255,255,255,0.08)] flex items-center px-3 shadow-inner">
            <Search className="w-3.5 h-3.5 text-[#5c6070]" />
            <span className="ml-2 text-[11px] text-[#5c6070] font-medium">Search anything... (Cmd+K)</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border border-[rgba(255,255,255,0.2)] shadow-sm"></div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-56 bg-[#12141a]/50 border-r border-[rgba(255,255,255,0.06)] p-4 flex flex-col gap-6 shrink-0 backdrop-blur-sm hidden sm:flex">
          <button className="w-full h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-indigo-500 transition-colors gap-2">
            <span className="text-lg leading-none">+</span> New Project
          </button>
          <div className="space-y-1">
            <div className="w-full h-9 bg-[rgba(99,102,241,0.15)] text-indigo-400 rounded-lg flex items-center px-3 gap-3 border border-[rgba(99,102,241,0.1)]">
              <Folder className="w-4 h-4" />
              <span className="text-sm font-medium">My Files</span>
            </div>
            <div className="w-full h-9 text-[#8b8fa3] rounded-lg flex items-center px-3 gap-3 hover:bg-[#1a1d25] transition-colors cursor-pointer">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Shared with me</span>
            </div>
            <div className="w-full h-9 text-[#8b8fa3] rounded-lg flex items-center px-3 gap-3 hover:bg-[#1a1d25] transition-colors cursor-pointer">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Starred</span>
            </div>
          </div>

          <div className="mt-auto p-4 bg-[#0b0d12] rounded-xl border border-[rgba(255,255,255,0.04)]">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-medium text-white">Storage</span>
              <span className="text-[10px] text-[#5c6070]">75%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1a1d25] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "75%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              ></motion.div>
            </div>
            <p className="text-[10px] text-[#5c6070] mt-2">75 GB of 100 GB used</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 bg-[#0b0d12]/30 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white tracking-tight">Recent Files</h2>
            <div className="flex gap-2">
              <div className="h-8 px-3 bg-[#1a1d25] text-xs text-[#8b8fa3] rounded-lg border border-[rgba(255,255,255,0.06)] flex items-center cursor-pointer hover:text-white transition-colors hidden sm:flex">Filter</div>
              <div className="h-8 px-3 bg-[#1a1d25] text-xs text-[#8b8fa3] rounded-lg border border-[rgba(255,255,255,0.06)] flex items-center cursor-pointer hover:text-white transition-colors hidden sm:flex">Sort</div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Q4 Financials.xlsx", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <FileText className="w-5 h-5" /> },
              { name: "Brand Guidelines.pdf", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: <ImageIcon className="w-5 h-5" /> },
              { name: "Project Alpha", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: <Folder className="w-5 h-5" /> },
              { name: "Client Contracts", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <Folder className="w-5 h-5" /> },
              { name: "UI Components.fig", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", icon: <FileIcon className="w-5 h-5" /> },
              { name: "Marketing Assets", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: <Folder className="w-5 h-5" /> },
            ].map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                viewport={{ once: true }}
                className="bg-[#12141a]/80 backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1a1d25]/80 transition-all group/card flex flex-col cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-5 rounded-xl ${file.bg} ${file.color} border ${file.border} flex items-center justify-center group-hover/card:scale-110 transition-transform`}>
                    {file.icon}
                  </div>
                  <div className="w-6 h-6 rounded-full hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#5c6070] flex gap-[2px]">
                      <div className="w-1 h-1 rounded-full bg-[#5c6070]"></div>
                      <div className="w-1 h-1 rounded-full bg-[#5c6070]"></div>
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-medium text-[#f0f0f3] truncate mb-1">{file.name}</h4>
                <p className="text-[10px] text-[#5c6070]">Just now</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d12] text-[#f0f0f3] font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-4 pb-20 md:pt-6 md:pb-32 px-6 flex flex-col items-center text-center z-10">
          {/* Enhanced Ambient Background */}
          <div className="absolute top-0 inset-x-0 h-[1000px] overflow-hidden pointer-events-none -z-10 flex justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            {/* Glowing Orbs */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-20%] w-[800px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"
            ></motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px]"
            ></motion.div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"
            ></motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl w-full flex flex-col items-center"
          >
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer group"
            >
              <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                Learn
              </span>
              <span className="text-sm font-medium text-[#e0e0e5] group-hover:text-white transition-colors">
                A personal cloud storage project.
              </span>
              <ChevronRight className="w-4 h-4 text-[#8b8fa3] group-hover:text-white transition-colors group-hover:translate-x-0.5" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-white mb-8 leading-[1.05] text-center max-w-4xl">
              A simple, secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">personal cloud.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#8b8fa3] max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              A learning project exploring how cloud storage platforms like Dropbox and Google Drive work under the hood.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
              <SignedOut>
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-14 px-8 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 group">
                    Sign Up
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a href="https://github.com/Itsmeinayath/CloudNest" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-14 px-8 bg-[rgba(255,255,255,0.05)] text-white border border-[rgba(255,255,255,0.1)] font-medium rounded-2xl hover:bg-[rgba(255,255,255,0.08)] transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                    View Code
                  </button>
                </a>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-14 px-8 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 group">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </SignedIn>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4 text-sm text-[#5c6070] font-medium flex-wrap">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/70" /> Built with Next.js</div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-[#3a3f50]"></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/70" /> Open Source</div>
            </div>
          </motion.div>
        </section>

        {/* Dashboard Preview Presentation */}
        <section className="pb-32 px-4 md:px-6 relative z-20" ref={targetRef} id="demo">
          <motion.div
            style={{ opacity, y }}
            className="container mx-auto max-w-5xl relative perspective-1000"
          >
            {/* Backdrop glow for dashboard */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 blur-[100px] -z-10 rounded-full transform scale-90"></div>

            <div className="rounded-3xl p-[1px] bg-gradient-to-b from-[rgba(255,255,255,0.15)] via-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] shadow-2xl shadow-black/50 group">
              <div className="rounded-3xl overflow-hidden bg-[#0b0d12]">
                <DashboardPreview />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Bento Box Features */}
        <section className="py-20 px-6 z-10 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Core features built<br />
                <span className="text-[#8b8fa3]">from scratch.</span>
              </h2>
              <p className="text-[#8b8fa3] max-w-xl text-lg leading-relaxed">
                CloudNest replicates essential cloud storage features to demonstrate a solid understanding of modern web development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[280px]">
              <BentoCard
                index={0}
                className="md:col-span-2 md:row-span-2"
                icon={<Cloud className="w-6 h-6" strokeWidth={2} />}
                title="Fast File Uploads"
                description="Upload and manage your files efficiently. Designed to handle various file types securely, simulating the reliability of professional cloud storage."
              />
              <BentoCard
                index={1}
                className="md:col-span-1 md:row-span-1"
                icon={<Shield className="w-6 h-6" strokeWidth={2} />}
                title="Secure Authentication"
                description="Powered by Clerk for safe and reliable user access, ensuring data privacy and proper session management."
              />
              <BentoCard
                index={2}
                className="md:col-span-1 md:row-span-1"
                icon={<Search className="w-6 h-6" strokeWidth={2} />}
                title="Quick Search"
                description="Find your files instantly using the built-in search functionality, designed for a smooth user experience."
              />
              <BentoCard
                index={3}
                className="md:col-span-1 md:row-span-1"
                icon={<Folder className="w-6 h-6" strokeWidth={2} />}
                title="File Organization"
                description="Group files into folders, star important items, and manage your trash just like a real operating system."
              />
              <BentoCard
                index={4}
                className="md:col-span-2 md:row-span-1"
                icon={<Zap className="w-6 h-6" strokeWidth={2} />}
                title="Modern Tech Stack"
                description="Built entirely with Next.js 14, Tailwind CSS, PostgreSQL, and Drizzle ORM to provide a fast, responsive, and robust application architecture."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 relative overflow-hidden z-10 border-t border-[rgba(255,255,255,0.04)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#12141a]/50 to-[#0b0d12] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto max-w-4xl text-center relative z-10 bg-[#12141a]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-12 md:p-20 rounded-[3rem] shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Check out the code or<br />try it yourself.
            </h2>
            <p className="text-[#8b8fa3] mb-10 text-lg max-w-2xl mx-auto">
              Explore the repository and learn how it's built, or create an account to test out the application firsthand.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <SignedOut>
                <Link href="/sign-up">
                  <button className="h-14 px-10 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] w-full sm:w-auto">
                    Sign Up
                  </button>
                </Link>
                <a href="https://github.com/Itsmeinayath/CloudNest" target="_blank" rel="noopener noreferrer">
                  <button className="h-14 px-10 bg-[rgba(255,255,255,0.05)] text-white border border-[rgba(255,255,255,0.1)] font-medium rounded-2xl hover:bg-[rgba(255,255,255,0.08)] transition-all w-full sm:w-auto">
                    GitHub Repo
                  </button>
                </a>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="h-14 px-10 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 w-full sm:w-auto">
                    Go to Dashboard
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0b0d12] pt-12 pb-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight text-lg">
                CloudNest
              </span>
            </div>

            <p className="text-[#5c6070] text-sm text-center md:text-left">
              A personal learning project exploring web development and cloud storage.
            </p>

            <div className="flex gap-6 text-sm text-[#8b8fa3]">
              <a href="https://github.com/Itsmeinayath/CloudNest" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Portfolio</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.06)] text-center text-xs text-[#5c6070]">
            &copy; {new Date().getFullYear()} CloudNest. Built for educational purposes.
          </div>
        </div>
      </footer>
    </div>
  );
}
