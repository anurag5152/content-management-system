import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import StorySidebar from "../components/StorySidebar";
import pdf from "../assets/pdf.png";
import image from "../assets/img.png";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const AddStory = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState("");
    const [highlights, setHighlights] = useState("");
    const [pdfFile, setPdfFile] = useState(null);


    const descRef = useRef(null);
    const highlightRef = useRef(null);


    const applyFormat = (cmd, ref) => {
        ref.current.focus();
        document.execCommand(cmd, false, null);
    };

    const applyAlign = (pos, ref) => {
        ref.current.focus();
        document.execCommand("justify" + pos, false, null);
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImagePreview(url);

        try {
            const fd = new FormData();
            fd.append("image", file);

            await axios.post(`${API}/api/story/upload-image`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    };

    return (
        <div className="h-screen flex bg-white overflow-hidden">
            <Sidebar />

            <main className="flex flex-1 overflow-hidden">
                <StorySidebar />

                <div className="flex-1 px-10 py-6 overflow-y-auto">

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-lg font-semibold text-slate-800">
                            New Article
                        </h1>

                        <div className="flex items-center gap-3">
                            <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium px-4 py-2 rounded-md">
                                Save as Draft
                            </button>

                            <button className="bg-[#243874] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md">
                                Submit
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 mb-5">
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="radio" name="storyType" defaultChecked />
                            Story
                        </label>

                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="radio" name="storyType" />
                            Live Blog
                        </label>

                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" />
                            Enable Paywall
                        </label>
                    </div>

                    <div className="grid grid-cols-12 gap-4">

                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Story URL (English) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="https://"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Short Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Article Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        <div className="col-span-12">
                            <label className="text-xs text-slate-700">
                                Slug Intro <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Topic Tags (1-2 tags in english){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        <div className="col-span-8"></div>

                        <div className="col-span-12">
                            <label className="text-xs text-slate-700">Description</label>

                            <div className="border border-slate-300 rounded bg-white p-3 min-h-[260px] text-xs mt-1">

                                <div className="flex items-center gap-3 border-b pb-2 mb-2 text-slate-600">
                                    <button onClick={() => applyFormat("bold", descRef)} className="font-bold">B</button>
                                    <button onClick={() => applyFormat("italic", descRef)} className="italic">I</button>
                                    <button onClick={() => applyFormat("underline", descRef)} className="underline">U</button>

                                    <button onClick={() => applyAlign("Left", descRef)}>L</button>
                                    <button onClick={() => applyAlign("Center", descRef)}>C</button>
                                    <button onClick={() => applyAlign("Right", descRef)}>R</button>
                                </div>

                                <div
                                    ref={descRef}
                                    contentEditable
                                    onInput={(e) => setDescription(e.target.innerText)}
                                    className="w-full min-h-[180px] bg-white outline-none text-xs"
                                ></div>
                            </div>
                        </div>

                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Meta Keywords <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        <div className="col-span-8">
                            <label className="text-xs text-slate-700">
                                Meta Description <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        <div
                            className="col-span-4 border border-slate-300 rounded bg-white h-[450px] flex flex-col items-center justify-center text-xs text-slate-600"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className="h-[90%] object-contain rounded"
                                />
                            ) : (
                                <>
                                    <div className="text-5xl mb-2">
                                        <img src={image} alt="img logo" />
                                    </div>
                                    <p>Drag and drop an image, or <label
                                        htmlFor="imgUpload"
                                        className="underline text-[#1967D2] mt-3 cursor-pointer"
                                    >
                                        Browse
                                    </label></p>
                                    <p className="text-[10px] mt-2">
                                        Minimum 800px width recommended. Max 10MB each
                                    </p>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="imgUpload"
                                onChange={(e) => handleImageUpload(e.target.files[0])}
                            />
                        </div>

                        <div className="col-span-8 grid grid-cols-12 gap-4">

                            <div className="col-span-6">
                                <label className="text-xs text-slate-700">District</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                                />
                            </div>

                            <div className="col-span-6">
                                <label className="text-xs text-slate-700">
                                    Mandal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                                />
                            </div>

                            <div className="col-span-6">
                                <label className="text-xs text-slate-700">Photo Caption</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                                />
                            </div>

                            <div className="col-span-6">
                                <label className="text-xs text-slate-700">Photo Credit</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                                />
                            </div>

                            <div className="col-span-6">
                                <label className="text-xs text-slate-700">Author</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                                />
                            </div>

                            <div className="col-span-6">
                                <label className="text-xs text-slate-700">Place</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                                />
                            </div>

                            <div className="col-span-12">
                                <label className="text-xs text-slate-700">Highlights</label>

                                <div className="border border-slate-300 rounded bg-white p-3 min-h-[170px] text-xs mt-1">

                                    <div className="flex items-center gap-3 border-b pb-2 mb-2 text-slate-600">
                                        <button onClick={() => applyFormat("bold", highlightRef)} className="font-bold">B</button>
                                        <button onClick={() => applyFormat("italic", highlightRef)} className="italic">I</button>
                                        <button onClick={() => applyFormat("underline", highlightRef)} className="underline">U</button>

                                        <button onClick={() => applyAlign("Left", highlightRef)}>L</button>
                                        <button onClick={() => applyAlign("Center", highlightRef)}>C</button>
                                        <button onClick={() => applyAlign("Right", highlightRef)}>R</button>
                                    </div>

                                    <div
                                        ref={highlightRef}
                                        contentEditable
                                        onInput={(e) => setHighlights(e.target.innerText)}
                                        className="w-full min-h-[90px] bg-white outline-none text-xs"
                                    ></div>
                                </div>
                            </div>
                            <div className="-mr-[15px] text-xs text-slate-900">
                                Google bot
                            </div>


                            <div className="col-span-12 flex items-center gap-6 mt-2 text-xs text-slate-700">

                                <div className="flex items-center gap-2">
                                    <label className="flex gap-1">
                                        <input type="radio" name="bot" /> Allow
                                    </label>
                                    <label className="flex gap-1">
                                        <input type="radio" name="bot" /> Disallow
                                    </label>
                                </div>

                                <label className="flex items-center gap-2">
                                    <input type="checkbox" />
                                    Exclude IA
                                </label>

                                <label className="flex items-center gap-2">
                                    <input type="checkbox" />
                                    Schedule Post
                                </label>
                            </div>
                        </div>

                        <div className="col-span-12 mt-4">
                            <div
                                className="border border-slate-300 rounded bg-white h-[200px] flex flex-col items-center justify-center text-xs text-slate-600"
                            >
                                <div className="text-5xl mb-2">
                                    <img src={pdf} alt="pdf logo" />
                                </div>

                                {pdfFile ? (
                                    <>
                                        <p className="text-xs font-medium text-green-700">
                                            {pdfFile.name}
                                        </p>

                                        <button
                                            className="underline text-red-500 text-[11px] mt-2"
                                            onClick={() => setPdfFile(null)}
                                        >
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p>Drag and drop PDF file here, or {!pdfFile && (
                                            <label
                                                htmlFor="pdfUpload"
                                                className="underline text-[#1967D2] cursor-pointer mt-3"
                                            >
                                                Browse
                                            </label>
                                        )}</p>
                                        <p className="text-[10px] mt-2">
                                            Max PDF file size is 10MB
                                        </p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    id="pdfUpload"
                                    onChange={(e) => {
                                        if (!e.target.files[0]) return;
                                        setPdfFile(e.target.files[0]);
                                    }}
                                />
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddStory;
