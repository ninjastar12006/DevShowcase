export default function BuilderModal({ title, onClose, onSave, saveLabel = "Save", children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-2xl border border-gray-700 bg-[rgb(25,25,25)] px-6 pb-6 pt-4">
                <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-400 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                <div className="pt-4">
                    {children}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-800"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500"
                    >
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}