"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUpload from "@/components/admin/FileUpload";

const subjects = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"];

export default function addQuestion() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [solution, setSolution] = useState("");
  const [subject, setSubject] = useState("PHYSICS");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (solution.trim().length < 5) {
      toast.error("❌ Solution must be at least 5 characters long.");
      return;
    }

    const payload = {
      question,
      options,
      correctAnswer,
      solution,
      subject,
      image: image || null,
    };

    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("✅ Question added successfully!");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
        setSolution("");
        setImage(null);
      } else {
        const errorData = await res.json();
        toast.error(`❌ Failed to add question: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("❌ An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📌 Add New Question</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image (Optional)</label>
            <FileUpload onUpload={(url) => setImage(url)} />
            {image && (
              <div className="w-32 h-32 border rounded-lg overflow-hidden mt-2">
                <img src={image} alt="Uploaded" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          {/* Options Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Options</label>
            {options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  setOptions(newOptions);
                }}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 mt-2"
              />
            ))}
          </div>

          {/* Correct Answer Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
            <input
              type="text"
              placeholder="Enter correct answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Solution Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Solution</label>
            <textarea
              placeholder="Enter solution/explanation"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 text-white rounded-md ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Question"}
          </button>
        </form>
      </div>
    </div>
  );
}
