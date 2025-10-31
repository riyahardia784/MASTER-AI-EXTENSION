import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";
import Header from "../components/Header";

function Create() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("Essay");
  const [length, setLength] = useState("medium");
  const [level, setLevel] = useState("Undergraduate");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("Recent");
  const [stored, setStored] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copied, setCopied] = useState(false); // ✅ added missing state

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  // ✅ Copy feature with 3s feedback
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // 🌙 Dark mode detection
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // 🧠 Generate report
  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a topic!");
    setLoading(true);
    setReport("");

    try {
      console.log("Generating report with:", { topic, type, length, level });

      const res = await fetch(`${BASE_URL}/api/create/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, type, length, level }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      console.log("Backend response:", data);

      const result = data.report || "No report generated.";
      setReport(result);

      // 💾 Save report in stored
      const saveRes = await fetch(`${BASE_URL}/api/create/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, type, length, level, content: result }),
      });

      if (!saveRes.ok) console.warn("Save request failed:", saveRes.status);
      else console.log("Report saved successfully");

      // 🔄 Refresh stored reports
      await fetchStored();
    } catch (err) {
      console.error("❌ Failed to generate report:", err);
      setReport("❌ Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  // 📦 Load stored reports
  const fetchStored = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/create/stored`);
      const data = await res.json();
      setStored(data || []);
    } catch (err) {
      console.error("Error fetching stored:", err);
    }
  };

  useEffect(() => {
    if (activeSection === "Stored") fetchStored();
  }, [activeSection]);

  // 🪟 Open in new tab
  const openInNewTab = (content, title = type) => {
    if (!content) return;
    const dark = isDarkMode;
    const styles = {
      bg: dark ? "#1e2733" : "#fcfbf1",
      text: dark ? "#fcfbf1" : "#323c4b",
      panel: dark ? "#2a333f" : "#efede9",
    };

    const htmlContent = marked.parse(content);
    const newTab = window.open("", "_blank");
    newTab.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Open Sans', sans-serif; background: ${styles.bg}; color: ${styles.text}; margin: 0; padding: 20px; }
            .container { min-width: 80%; background: ${styles.panel}; padding: 30px; border-radius: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-size: 18px; margin: 30px auto; line-height: 1.6; overflow-x: auto; }
            h2, h3, h4, strong { color: #0694d1; }
            #title { text-align: center; font-size: 32px; margin-bottom: 20px; color: #0694d1; }
             .container::-webkit-scrollbar {
            display: none;
            }
          </style>
        </head>
        <body>
          <h1 id="title">${type}</h1>
          <div class="container">${htmlContent}</div>
        </body>
      </html>
    `);
    newTab.document.close();
  };

  const handleExpand = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleZoom = (dir) => {
    setZoom((prev) =>
      dir === "in" ? Math.min(prev + 0.1, 2) :
      dir === "out" ? Math.max(prev - 0.1, 0.5) : 1
    );
  };

  const extractTitle = (content, maxLength = 60) => {
    if (!content) return "Untitled";
    let heading = content.split("\n").find(line => line.startsWith("#"));
    if (heading) heading = heading.replace(/^#+\s*/, "").trim();
    let title = heading || content.split("\n")[0].split(".")[0].trim();
    title = title.replace(/\n/g, " ").trim();
    if (title.length > maxLength) title = title.slice(0, maxLength) + "...";
    return title || "Untitled";
  };

  const recentTitle = extractTitle(report);

  return (
    <div className="w-[400px] h-[450px] overflow-hidden">
      <div className="w-full h-full bg-[#fcfbf1] dark:bg-[#323c4b] flex flex-col p-4 transition-all duration-300">
        <Header />

        {/* === Tabs === */}
        <div className="flex justify-between mt-4 bg-[#efede9] dark:bg-[#2a333f] rounded-full p-1 shadow-sm">
          {["Recent", "Stored"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`w-1/2 py-2 rounded-full font-semibold transition-all text-lg ${
                activeSection === tab
                  ? "linear text-white"
                  : "text-[#0694d1] dark:text-[#fcfbf1]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* === RECENT SECTION === */}
        {activeSection === "Recent" && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
              className="w-full h-[40px] bg-transparent border-2 border-[#0694d1] rounded-full shadow-sm px-3 text-lg text-[#0694d1] dark:placeholder:text-[#fcfbf1] dark:text-[#fcfbf1] focus:outline-none"
            />

            {/* Type / Length / Level */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {/* selects unchanged */}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-transparent border border-[#0694d1] rounded-full px-3 py-1 text-sm text-[#0694d1] dark:text-[#fcfbf1] focus:outline-none"
              >
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]">Essay</option>
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]">Lab Report</option>
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]">Research Summary</option>
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]">Case Study</option>
              </select>

              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="bg-transparent border border-[#0694d1] rounded-full px-3 py-1 text-sm text-[#0694d1] dark:text-[#fcfbf1] focus:outline-none"
              >
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]" value="short">Short</option>
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]" value="medium">Medium</option>
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]" value="long">Long</option>
              </select>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-transparent border border-[#0694d1] rounded-full px-3 py-1 text-sm text-[#0694d1] dark:text-[#fcfbf1] focus:outline-none"
              >
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]">Undergraduate</option>
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]">Graduate</option>
                <option className="bg-[#fcfbf1] dark:bg-[#2a333f]">Postgraduate</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-3/4 h-[45px] mt-2 text-lg font-semibold linear text-white rounded-full hover:bg-[#047cb0] transition-all disabled:opacity-60"
            >
              {loading ? "Generating..." : `Generate ${type}`}
            </button>

            {report && (
              <div className="mt-5 h-[70px] bg-[#efede9] dark:bg-[#2a333f] rounded-lg shadow-md flex items-center justify-between overflow-hidden px-4 relative w-full">
                <p className="absolute top-0 left-0 p-1 text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#5de0e6] to-[#004aad]  animate-glow">{`${type}`}</p>
                <h3 className="font-semibold text-[#0694d1] mt-5 text-[12px] "> {recentTitle}</h3>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => handleExpand({ report, type })}
                    className=" h-7 linear text-white rounded-md p-1 font-bold  "
                  >
                    Expand
                  </button>
                  <button
                    onClick={() => openInNewTab(report, recentTitle)}
                    className="h-7 linear text-white rounded-md p-1 font-bold"
                  >
                    Open
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === STORED SECTION === */}
        {activeSection === "Stored" && (
          <div className="storeTab mt-5 flex flex-col gap-3 overflow-auto h-[340px]">
            {stored.length === 0 ? (
              <p className="text-center text-[#0694d1]">No stored items yet.</p>
            ) : (
              stored
                .sort((a, b) => a.type.localeCompare(b.type))
                .map((item, idx) => {
                  const title = extractTitle(item.report);
                  return (
                    <div key={idx} className="bg-[#efede9] dark:bg-[#2a333f] rounded-lg shadow-md">
                      <div className="flex justify-between items-center relative h-[70px] w-full overflow-hidden">
                        <p className="absolute top-0 left-0 p-1 text-sm font-semibold rounded-md text-transparent bg-clip-text bg-gradient-to-r from-[#5de0e6] to-[#004aad]">{`${item.type}`}</p>
                        <h3 className="font-semibold text-[#0694d1] mt-5 text-[12px] px-3 tracking-tighter">{title}</h3>
                        <div className="flex gap-3 text-sm mr-3">
                          <button
                            onClick={() => handleExpand(item)}
                            className="h-7 linear text-white rounded-md p-1 font-bold"
                          >
                            Expand
                          </button>
                          <button
                            onClick={() => openInNewTab(item.report, title)}
                            className="h-7 linear text-white rounded-md p-1 font-bold"
                          >
                            Opened
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* === EXPAND MODAL === */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center "
          style={{
            backgroundColor: isDarkMode ? "#0f172aee" : "rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="relative w-[95%] h-[95%] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: isDarkMode ? "#1e2733" : "#fcfbf1",
              color: isDarkMode ? "#fcfbf1" : "#323c4b",
            }}
          >
            <div className="flex justify-between items-center p-4 text-white linear rounded-t-2xl">
              <h2 className="text-xl font-semibold">Full {selectedItem.type} View</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => handleZoom("out")}
                  className="bg-white text-[#0694d1] px-2 rounded-full font-bold"
                >
                  −
                </button>
                <button
                  onClick={() => handleZoom("in")}
                  className="bg-white text-[#0694d1] px-2 rounded-full font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => handleZoom("reset")}
                  className="bg-white text-[#0694d1] px-3 rounded-full text-sm font-semibold"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 text-white px-3 rounded-full text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* === Report content + copy === */}
            <div
              className="flex-1 p-6 overflow-auto prose dark:prose-invert storeTab relative"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                backgroundColor: isDarkMode ? "#2a333f" : "#efede9",
                borderRadius: "12px",
              }}
            >
              <ReactMarkdown>{selectedItem.report}</ReactMarkdown>

              <button
                onClick={() => copyToClipboard(selectedItem.report)}
                className="absolute right-4 top-0 rounded-full linear text-white px-3 py-1 mt-2 text-sm font-semibold z-10"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create;
