import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch documents
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/hoaadmin/getdocuments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data.documents || []);
      } catch (err) {
        setError("Could not load documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [navigate, success]);

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFile(e.target.files[0]);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    setError("");
    setSuccess("");
  };

  // Handle upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/hoaadmin/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.message || "Document uploaded successfully.");
      setForm({ title: "", description: "" });
      setFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload document.");
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/hoaadmin/deletedocument/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Document deleted.");
    } catch (err) {
      setError("Could not delete document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HOAHeaderNavbar>
      <div
        className="relative min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">

            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Documents
            </h2>

            {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col mb-8 w-full gap-4"
              encType="multipart/form-data"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Document Title"
                  maxLength={80}
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                />

                <input
                  type="text"
                  name="description"
                  placeholder="Document Description"
                  maxLength={300}
                  required
                  value={form.description}
                  onChange={handleChange}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                />
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                required
                onChange={handleChange}
                className="rounded-lg border text-black border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
              />

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 text-xl bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold disabled:opacity-70"
                >
                  {loading ? "Uploading..." : "UPLOAD"}
                </button>
              </div>
            </form>

            {/* DOCUMENTS TABLE */}
            <div className="w-full">
              <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70 mt-4">
                <table className="min-w-full table-fixed text-sm md:text-base">
                  <thead>
                    <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                      <th className="p-4 text-left font-bold w-2/12">Title</th>
                      <th className="p-4 text-left font-bold w-4/12">Description</th>
                      <th className="p-4 text-left font-bold w-2/12">File Type</th>
                      <th className="p-4 text-left font-bold w-3/12">Uploaded By</th>
                      <th className="p-4 text-center font-bold w-1/12">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && documents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : documents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                        >
                          No documents found.
                        </td>
                      </tr>
                    ) : (
                      documents.map((doc, index) => (
                        <tr
                          key={doc._id}
                          className={`transition-colors ${
                            index % 2 === 0
                              ? "bg-white/100 dark:bg-emerald-900/40"
                              : "bg-emerald-100/50 dark:bg-emerald-900/60"
                          } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                        >
                          <td className="px-4 py-3 text-black font-medium">{doc.title}</td>
                          <td className="px-4 py-3 text-black font-medium">{doc.description}</td>
                          <td className="px-4 py-3 text-black font-medium">{doc.fileType}</td>
                          <td className="px-4 py-3 text-black font-medium">
                            {doc.user?.name} ({doc.user?.email})
                          </td>
                          <td className="px-4 py-3 text-center text-black font-medium">
                            <button
                              onClick={() => handleDelete(doc._id)}
                              className="px-4 py-2 bg-green-900 hover:bg-red-700 text-white rounded-lg font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Documents;
