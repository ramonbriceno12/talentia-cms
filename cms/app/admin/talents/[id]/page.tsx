"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthFetch } from "../../utils/useAuthFetch";
import Select from "react-select";

interface Talent {
    id: number;
    full_name: string;
    email: string;
    bio: string;
    profile_picture: string | null;
    job_title_id: number | null;
    job_title?: { title: string };
}

interface Skill {
    id: number;
    name: string;
}

interface JobTitle {
    id: number;
    title: string;
}

export default function TalentDetailPage() {
    const router = useRouter();
    const authFetch = useAuthFetch(); // Use the secure fetch
    const { id } = useParams();

    const [talent, setTalent] = useState<Talent | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Talent | null>(null);
    const [successMessage, setSuccessMessage] = useState("");


    useEffect(() => {
        if (id) {
            fetchTalent();
            fetchJobTitles();
            fetchSkills();
        }
    }, [id]); // ✅ Ensure effect runs when `id` changes

    // Fetch talent data
    const fetchTalent = async () => {
        setLoading(true);
        try {
            console.log("Fetching talent...");
            const data = await authFetch(`https://admin.talentiave.com/api/api/talents/${id}`);

            if (data) {
                console.log("Talent data received:", data);

                setTalent(data.talent);
                setFormData(data.talent); // ✅ Ensure `formData` is updated
                setSelectedJobTitle(
                    data.talent.job_title_id
                        ? { id: data.talent.job_title_id, title: data.talent.job_title.title }
                        : null
                );
                setSelectedSkills(data.skills || []);
            }
        } catch (err: any) {
            console.error("Fetch error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch job titles
    const fetchJobTitles = async () => {
        try {
            console.log("Fetching job titles...");
            const data = await authFetch("https://admin.talentiave.com/api/api/job-titles");
            console.log("Job Titles Data:", data);

            if (Array.isArray(data)) {
                setJobTitles(data);
            } else {
                setJobTitles([]);
            }
        } catch (err: any) {
            console.error("Error fetching job titles:", err.message);
            setJobTitles([]);
        }
    };

    // Fetch all available skills
    const fetchSkills = async () => {
        try {
            console.log("Fetching skills...");
            const data = await authFetch("https://admin.talentiave.com/api/api/skills");
            console.log("Skills Data:", data);

            if (Array.isArray(data)) {
                setSkills(data);
            } else {
                setSkills([]);
            }
        } catch (err: any) {
            console.error("Error fetching skills:", err.message);
            setSkills([]);
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Validate inputs
    const validateInputs = () => {
        if (!formData) return "Form data is missing.";
        if (!formData.full_name.trim()) return "Full Name is required.";
        if (!formData.email.trim() || !formData.email.includes("@")) return "Valid email is required.";
        return null;
    };

    // Save talent details
    const handleSave = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError("");

        try {
            const response = await authFetch(`https://admin.talentiave.com/api/api/talents/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    job_title_id: selectedJobTitle?.id || null,
                    skills: selectedSkills.map((s) => s.id),
                }),
            });

            if (!response) throw new Error("Failed to update talent");
            setSuccessMessage("Successfully updated! ✅");
            setTimeout(() => setSuccessMessage(""), 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    console.log("Talent:", talent);
    console.log("Job Titles:", jobTitles);
    console.log("Skills:", skills);

    return (
        <div className="bg-white shadow-md p-6 rounded-lg h-auto flex flex-col mx-auto w-full">
            {loading ? (
                <p>Loading talent data...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : talent && formData ? (
                <>
                    {successMessage && (
                        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                            {successMessage}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-[#244c56]">Edit Talent</h2>

                    <div className="space-y-4 mt-4">
                        {/* Full Name */}
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full text-[#10282c] border p-2 rounded-md"
                        />

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full text-[#10282c] border p-2 rounded-md"
                        />

                        {/* Bio */}
                        <textarea
                            name="bio"
                            value={formData.bio || ""}
                            onChange={handleChange}
                            className="w-full text-[#10282c] border p-2 rounded-md h-32"
                        />
                        {/* Resume File */}
                        {formData.resume_file && (
                            <div>
                                <label className="text-gray-700 font-semibold">Resume</label>
                                <div className="mt-1">
                                    <a
                                        href={formData.resume_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#244c56] font-medium hover:underline"
                                    >
                                        View Resume 📄
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Profile Picture */}
                        {formData.profile_picture && (
                            <div>
                                <label className="text-gray-700 font-semibold">Profile Picture</label>
                                <div className="mt-1">
                                    <a
                                        href={formData.profile_picture}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#244c56] font-medium hover:underline"
                                    >
                                        View Profile Picture 📄
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Job Title Dropdown */}
                        <div>
                            <label className="text-gray-700 font-semibold">Job Title</label>
                            <Select
                                options={jobTitles.map((job) => ({ value: job.id, label: job.title }))}
                                value={selectedJobTitle ? { value: selectedJobTitle.id, label: selectedJobTitle.title } : null}
                                onChange={(selected) => setSelectedJobTitle(selected ? { id: selected.value, title: selected.label } : null)}
                                className="w-full text-[#10282c] p-2"
                            />
                        </div>

                        {/* Skills Multi-Select */}
                        <div>
                            <label className="text-gray-700 font-semibold">Skills</label>
                            <Select
                                isMulti
                                options={skills.map((skill) => ({ value: skill.id, label: skill.name }))}
                                value={selectedSkills.map((skill) => ({ value: skill.id, label: skill.name }))}
                                onChange={(selected) => setSelectedSkills(selected.map((s) => ({ id: s.value, name: s.label })))}
                                className="w-full text-[#10282c]"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="mt-4 w-full p-3 bg-[#244c56] text-white rounded-md"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
}
