"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page() {
  const [form, setForm] = useState({
    project: "",
    backend: "FastAPI",
    frontend: "React",
    database: "MariaDB",
    vibe: "clean, minimal, production-ready",
    extra: "",
  });

  const [output, setOutput] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Load from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get("project")) {
      setForm({
        project: params.get("project") || "",
        backend: params.get("backend") || "FastAPI",
        frontend: params.get("frontend") || "React",
        database: params.get("database") || "MariaDB",
        vibe:
          params.get("vibe") || "clean, minimal, production-ready",
        extra: params.get("extra") || "",
      });
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const generatePrompt = () => {
    const prompt = `You are a senior software engineer.

Task:
Build a ${form.project}

Tech Stack:
- Backend: ${form.backend}
- Frontend: ${form.frontend}
- Database: ${form.database}

Vibe:
- ${form.vibe}

Constraints:
- Clean architecture
- Modular code
- Readable and maintainable
- Avoid unnecessary dependencies

Extra Requirements:
${form.extra}

Output:
1. Project structure
2. Code (separated files)
3. Explanation (concise)
`;
    setOutput(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert("Copied!");
  };

  const savePreset = async () => {
    if (!user) return alert("Please login first");

    await supabase.from("presets").insert([
      {
        ...form,
        user_id: user.id,
      },
    ]);

    alert("Saved!");
  };

  const exportFile = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    a.click();
  };

  const shareURL = () => {
    const params = new URLSearchParams(form as any).toString();
    const url = `${window.location.origin}?${params}`;

    navigator.clipboard.writeText(url);
    alert("Share link copied!");
  };

  const aiImprove = async () => {
    const res = await fetch("/api/improve", {
      method: "POST",
      body: JSON.stringify({ prompt: output }),
    });

    const data = await res.json();
    setOutput(data.result);
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">
          🔥 Prompt Generator Pro
        </h1>

        {!user ? (
          <button
            onClick={login}
            className="mb-4 bg-yellow-400 text-black px-4 py-2 rounded-xl"
          >
            Login with Google
          </button>
        ) : (
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm">
              Logged in: {user.email}
            </span>
            <button
              onClick={logout}
              className="bg-red-400 text-black px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}

        <div className="grid gap-3">
          <input
            className="p-3 rounded-xl bg-slate-800"
            placeholder="Project"
            value={form.project}
            onChange={(e) =>
              handleChange("project", e.target.value)
            }
          />

          <div className="grid grid-cols-3 gap-2">
            <input
              className="p-3 rounded-xl bg-slate-800"
              value={form.backend}
              onChange={(e) =>
                handleChange("backend", e.target.value)
              }
            />
            <input
              className="p-3 rounded-xl bg-slate-800"
              value={form.frontend}
              onChange={(e) =>
                handleChange("frontend", e.target.value)
              }
            />
            <input
              className="p-3 rounded-xl bg-slate-800"
              value={form.database}
              onChange={(e) =>
                handleChange("database", e.target.value)
              }
            />
          </div>

          <select
            className="p-3 rounded-xl bg-slate-800"
            value={form.vibe}
            onChange={(e) =>
              handleChange("vibe", e.target.value)
            }
          >
            <option>clean, minimal, production-ready</option>
            <option>hacker, fast, minimal</option>
            <option>enterprise, scalable, robust</option>
            <option>indie, creative, elegant</option>
          </select>

          <textarea
            className="p-3 rounded-xl bg-slate-800"
            placeholder="Extra requirements"
            value={form.extra}
            onChange={(e) =>
              handleChange("extra", e.target.value)
            }
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={generatePrompt}
              className="bg-cyan-400 text-black px-4 py-2 rounded-xl"
            >
              Generate
            </button>

            <button
              onClick={copyToClipboard}
              className="bg-gray-400 text-black px-4 py-2 rounded-xl"
            >
              Copy
            </button>

            <button
              onClick={savePreset}
              className="bg-green-400 text-black px-4 py-2 rounded-xl"
            >
              Save
            </button>

            <button
              onClick={exportFile}
              className="bg-purple-400 text-black px-4 py-2 rounded-xl"
            >
              Export
            </button>

            <button
              onClick={shareURL}
              className="bg-blue-400 text-black px-4 py-2 rounded-xl"
            >
              Share
            </button>

            <button
              onClick={aiImprove}
              className="bg-pink-400 text-black px-4 py-2 rounded-xl"
            >
              AI Improve
            </button>
          </div>
        </div>

        {output && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg">Result</h2>
            <pre className="bg-slate-900 p-4 rounded-xl whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}