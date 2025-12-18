import Sidebar from "../components/Sidebar";
import StorySidebar from "../components/StorySidebar";

const AddStory = () => {
    return (
        <div className="h-screen flex bg-white overflow-hidden">
            <Sidebar />

            <main className="flex flex-1 overflow-hidden">
                <StorySidebar />

                <div className="flex-1 px-10 py-6 overflow-y-auto">
                    {/* HEADER */}
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

                    {/* STORY TYPE OPTIONS */}
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

                    {/* FORM GRID */}
                    <div className="grid grid-cols-12 gap-4">
                        {/* STORY URL */}
                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Story URL (English) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                                placeholder="https://"
                            />
                        </div>

                        {/* SHORT TITLE */}
                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Short Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        {/* ARTICLE TITLE */}
                        <div className="col-span-4">
                            <label className="text-xs text-slate-700">
                                Article Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        {/* SLUG INTRO */}
                        <div className="col-span-12">
                            <label className="text-xs text-slate-700">
                                Slug Intro <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        {/* TOPIC TAGS */}
                        <div className="col-span-12">
                            <label className="text-xs text-slate-700">
                                Topic Tags (1-2 tags in english){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="col-span-12">
                            <label className="text-xs text-slate-700">Description</label>

                            <div className="border border-slate-300 rounded min-h-[220px] bg-white p-3 text-xs mt-1">
                                {/* fake editor toolbar */}
                                <div className="flex items-center gap-3 border-b pb-2 mb-2 text-slate-500 text-xs">
                                    B I U A • alignment • link • code
                                </div>

                                <textarea
                                    className="w-full h-[160px] bg-white focus:outline-none text-xs resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* META KEYWORDS */}
                        <div className="col-span-6">
                            <label className="text-xs text-slate-700">
                                Meta Keywords <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        {/* META DESCRIPTION */}
                        <div className="col-span-6">
                            <label className="text-xs text-slate-700">
                                Meta Description <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 bg-white rounded px-3 py-2 text-xs mt-1"
                            />
                        </div>

                        {/* IMAGE UPLOAD BOX */}
                        <div className="col-span-4">
                            <div className="border border-slate-300 rounded bg-white h-[250px] flex flex-col items-center justify-center text-xs text-slate-600">
                                <div className="text-5xl mb-2">📷</div>
                                <p>Drag and drop an image, or Browse</p>
                                <p className="text-[10px] mt-2">
                                    Minimum 800px width recommended. Max 10MB each
                                </p>
                            </div>
                        </div>

                        {/* DETAILS RIGHT SIDE */}
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

                            {/* HIGHLIGHTS */}
                            <div className="col-span-12">
                                <label className="text-xs text-slate-700">Highlights</label>

                                <div className="border border-slate-300 rounded bg-white p-3 min-h-[120px] text-xs mt-1">
                                    {/* fake toolbar */}
                                    <div className="flex items-center gap-3 border-b pb-2 mb-2 text-slate-500 text-xs">
                                        B I U A • alignment • link • code
                                    </div>

                                    <textarea
                                        className="w-full h-[70px] bg-white focus:outline-none text-xs resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* GOOGLE BOT + CHECKBOXES */}
                        <div className="col-span-12 flex items-center gap-6 mt-2 text-xs text-slate-700">
                            <div>
                                <span>Google Bot</span>
                            </div>
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

                        {/* PDF UPLOAD BOX */}
                        <div className="col-span-12 mt-4">
                            <div className="border border-slate-300 rounded bg-white h-[200px] flex flex-col items-center justify-center text-xs text-slate-600">
                                <div className="text-5xl mb-2">📄</div>
                                <p>Drag and drop PDF file here, or Browse</p>
                                <p className="text-[10px] mt-2">
                                    Max PDF file size is 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddStory;
