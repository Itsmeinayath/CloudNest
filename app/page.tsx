"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Cloud, Lock, Zap, Search, Shield, File as FileIcon, Folder, Image as ImageIcon, FileText, BarChart3, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

/* Feature Card */
const FeatureCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    viewport={{ once: true }}
    className="p-7 bg-[#12141a] border border-[rgba(255,255,255,0.06)] rounded-2xl hover:border-[rgba(255,255,255,0.12)] transition-all duration-300 group"
  >
    <div className="w-11 h-11 mb-5 flex items-center justify-center rounded-xl bg-[rgba(99,102,241,0.1)] text-indigo-400 group-hover:bg-[rgba(99,102,241,0.15)] transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-[#8b8fa3] text-sm leading-relaxed">{description}</p>
  </motion.div>
);




/* High-Fidelity Dashboard Mockup */
const DashboardPreview = () => (
  <div className="w-full aspect-[16/10] bg-[#0b0d12] rounded-xl overflow-hidden flex flex-col border border-[rgba(255,255,255,0.08)]">
    {/* Window Chrome */}
    <div className="h-11 bg-[#12141a] border-b border-[rgba(255,255,255,0.06)] flex items-center px-4 gap-3 shrink-0">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="h-6 w-56 bg-[#1a1d25] rounded-md border border-[rgba(255,255,255,0.06)] flex items-center px-3">
          <Search className="w-3 h-3 text-[#5c6070]" />
          <span className="ml-2 text-[10px] text-[#5c6070]">Search files...</span>
        </div>
      </div>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600"></div>
    </div>

    {/* Body */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 bg-[#12141a] border-r border-[rgba(255,255,255,0.06)] p-4 flex flex-col gap-5 shrink-0">
        <button className="w-full h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-medium shadow-lg shadow-indigo-600/20">
          + Upload File
        </button>
        <div className="space-y-0.5">
          <div className="w-full h-8 bg-[rgba(99,102,241,0.1)] text-indigo-400 rounded-lg flex items-center px-3 gap-2.5">
            <Folder className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">My Files</span>
          </div>
          <div className="w-full h-8 text-[#5c6070] rounded-lg flex items-center px-3 gap-2.5 hover:bg-[#1a1d25] transition-colors">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Shared</span>
          </div>
          <div className="w-full h-8 text-[#5c6070] rounded-lg flex items-center px-3 gap-2.5 hover:bg-[#1a1d25] transition-colors">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Analytics</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="w-full h-1.5 bg-[#1a1d25] rounded-full overflow-hidden">
            <div className="w-[45%] h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
          </div>
          <p className="text-[9px] text-[#5c6070] mt-2">4.5 GB of 10 GB used</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#0e1015] overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Recent Files</h2>
          <span className="text-[10px] text-[#5c6070] px-2 py-1 bg-[#1a1d25] rounded-md border border-[rgba(255,255,255,0.06)]">12 files</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Q4 Report.xlsx", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: <FileText className="w-5 h-5" /> },
            { name: "Brand Kit.pdf", color: "text-rose-400", bg: "bg-rose-500/10", icon: <ImageIcon className="w-5 h-5" /> },
            { name: "Project Alpha", color: "text-indigo-400", bg: "bg-indigo-500/10", icon: <Folder className="w-5 h-5" /> },
            { name: "Contracts.docx", color: "text-blue-400", bg: "bg-blue-500/10", icon: <FileText className="w-5 h-5" /> },
            { name: "Design System", color: "text-violet-400", bg: "bg-violet-500/10", icon: <Folder className="w-5 h-5" /> },
            { name: "Hero Banner.png", color: "text-amber-400", bg: "bg-amber-500/10", icon: <ImageIcon className="w-5 h-5" /> },
          ].map((file, i) => (
            <div key={i} className="bg-[#12141a] border border-[rgba(255,255,255,0.06)] rounded-xl p-3.5 hover:border-[rgba(255,255,255,0.12)] transition-all group/card flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-lg ${file.bg} ${file.color} flex items-center justify-center`}>
                  {file.icon}
                </div>
              </div>
              <h4 className="text-[11px] font-medium text-[#e0e0e5] truncate">{file.name}</h4>
              <p className="text-[9px] text-[#5c6070] mt-0.5">Edited 2h ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* Page */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d12] text-[#f0f0f3] font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-[900px] overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px]"></div>
          <div className="absolute top-[100px] left-[15%] w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[100px]"></div>
          <div className="absolute top-[200px] right-[15%] w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6 flex flex-col items-center text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#12141a] border border-[rgba(255,255,255,0.08)] text-xs font-medium text-[#8b8fa3]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              CloudNest v2.0 — Now available
            </div>

            <h1 className="text-5xl md:text-[4.25rem] lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
              The workspace<br className="hidden md:block" /> built for
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"> modern teams.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#8b8fa3] max-w-2xl mx-auto mb-10 leading-relaxed">
              Securely store, organise, and collaborate on files with a workspace designed for speed, clarity, and enterprise-grade reliability.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <SignedOut>
                <Link href="/sign-up">
                  <button className="h-12 px-7 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/30 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/sign-in">
                  <button className="h-12 px-7 bg-[#12141a] text-[#8b8fa3] border border-[rgba(255,255,255,0.08)] font-medium rounded-xl hover:text-white hover:border-[rgba(255,255,255,0.15)] transition-all">
                    Log in
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 h-12 px-7 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25">
                    Go to Workspace <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        </section>

        {/* Dashboard Preview */}
        <section className="pb-28 px-4 md:px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="container mx-auto max-w-5xl"
          >
            <div className="rounded-2xl p-[1px] bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.02)] shadow-2xl shadow-indigo-900/10">
              <div className="rounded-2xl overflow-hidden">
                <DashboardPreview />
              </div>
            </div>
          </motion.div>
        </section>



        {/* Features */}
        <section className="py-24 px-6 z-10 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                Engineered for efficiency.
              </h2>
              <p className="text-[#8b8fa3] max-w-xl mx-auto text-lg leading-relaxed">
                Every detail crafted to reduce friction and keep your team moving fast.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard index={0} icon={<Cloud className="w-5 h-5" strokeWidth={1.5} />}
                title="Instant Sync"
                description="Files synchronise across all devices in real time. No spinners, no waiting — just seamless continuity." />
              <FeatureCard index={1} icon={<Shield className="w-5 h-5" strokeWidth={1.5} />}
                title="End-to-End Encryption"
                description="Enterprise-grade AES-256 encryption ensures only you and your team can access your data." />
              <FeatureCard index={2} icon={<Search className="w-5 h-5" strokeWidth={1.5} />}
                title="Global Search"
                description="Press Cmd+K to find any file instantly. Our indexer runs continuously in the background." />
              <FeatureCard index={3} icon={<Lock className="w-5 h-5" strokeWidth={1.5} />}
                title="Granular Permissions"
                description="Share links with expiration dates, passwords, and fine-grained access controls." />
              <FeatureCard index={4} icon={<Zap className="w-5 h-5" strokeWidth={1.5} />}
                title="Edge Network"
                description="Deployed on a global edge network to deliver sub-50ms latency worldwide." />
              <FeatureCard index={5} icon={<FileIcon className="w-5 h-5" strokeWidth={1.5} />}
                title="Developer API"
                description="Integrate CloudNest into your workflows with our comprehensive REST and webhook APIs." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-600/5 to-transparent pointer-events-none"></div>
          <div className="container mx-auto max-w-3xl text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to elevate your workflow?
            </h2>
            <p className="text-[#8b8fa3] mb-10 text-lg">
              Join thousands of teams building on CloudNest.
            </p>
            <SignedOut>
              <Link href="/sign-up">
                <button className="h-14 px-8 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25">
                  Create your free account
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="h-14 px-8 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25">
                  Enter Dashboard
                </button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.04)] py-12 text-[#5c6070] text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2.5 font-medium text-white mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md flex items-center justify-center">
              <Cloud className="w-3 h-3 text-white" />
            </div>
            CloudNest
          </div>
          <div className="flex gap-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-white transition-colors">Product</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} CloudNest Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
