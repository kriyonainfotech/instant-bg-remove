import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiSun, FiMoon, FiUpload, FiDownload } from "react-icons/fi";

export default function HomePage() {
  const [theme, setTheme] = useState("light");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (files) => handleUpload(files[0]),
  });

  const handleUpload = async (file) => {
    setIsProcessing(true);
    setUploadedImage(URL.createObjectURL(file));

    // Simulate processing delay
    setTimeout(() => {
      setProcessedImage(URL.createObjectURL(file)); // Replace with actual processed image
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">BGRemover</h1>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {!uploadedImage ? (
          // Upload Section
          <section className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Remove Background from Image Instantly
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              100% automatic & free — just upload your photo.
            </p>

            <div
              {...getRootProps()}
              className={`border-4 border-dashed rounded-xl p-12 cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-gray-800"
                    : "border-gray-300 hover:border-blue-500 dark:border-gray-600"
                }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <FiUpload className="mx-auto text-3xl" />
                <p className="font-medium">
                  {isDragActive ? "Drop image here" : "Click to upload"}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  — or drag and drop —
                </p>
              </div>
            </div>
          </section>
        ) : (
          // Processing/Result Section
          <section className="max-w-4xl mx-auto">
            {isProcessing ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Processing your image...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium">Original</h3>
                  <img
                    src={uploadedImage}
                    alt="Original"
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Result</h3>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="rounded-lg shadow-lg"
                  />
                  <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                    onClick={() => {
                      /* Add download logic */
                    }}
                  >
                    <FiDownload /> Download Result
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Features Section */}
        <section className="max-w-4xl mx-auto mt-24">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <div className="text-blue-500 text-3xl mb-4">✨</div>
              <h3 className="font-medium mb-2">One Click Removal</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Instant background removal with single click
              </p>
            </div>
            {/* Add other features similarly */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-24 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          © 2023 BGRemover. Open source on GitHub
        </p>
      </footer>
    </div>
  );
}
