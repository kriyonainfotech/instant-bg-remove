import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "./spinner"; // Create this simple spinner component

const Home = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(
      Object.assign(uploadedFile, {
        preview: URL.createObjectURL(uploadedFile),
      })
    );
    setResultImage(null); // Reset the result image when a new file is uploaded
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleRemoveBackground = async () => {
    if (!file) {
      console.error("❌ No file selected.");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", file);

    console.log("📤 Sending image to backend for processing:", file.name);

    try {
      const response = await fetch(
        "http://localhost:5000/api/remove-background",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("⚠️ Failed to remove background:", response.statusText);
        alert("Failed to remove background. Please try again.");
        return;
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      console.log("✅ Background removal successful!");

      setResultImage(imageUrl);
    } catch (error) {
      console.error("❌ Error during background removal:", error);
      alert("Error during background removal. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-4 text-gray-800"
        >
          Remove Backgrounds in Seconds
        </motion.h1>
        <p className="text-center text-gray-600 mb-8">
          No design skills needed
        </p>

        {/* Dropzone */}
        {!file && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop image, or click to select"}
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </button>
            </div>
          </motion.div>
        )}

        {/* Preview Section */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex flex-col gap-6"
          >
            {/* Original Image Preview */}
            <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={file.preview}
                alt="Preview"
                className="w-full max-h-96 object-contain"
              />
            </div>

            {/* Remove Background Button */}
            {!resultImage && (
              <button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>Magic is happening...</span>
                  </div>
                ) : (
                  "Remove Background"
                )}
              </button>
            )}

            {/* Result Image with Overlay Preview */}
            {resultImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col space-y-4"
              >
                {/* Checkered background container */}
                <div className="relative w-full h-full max-h-96 bg-checkered rounded-xl overflow-hidden shadow-md">
                  <style>{`
            .bg-checkered {
              background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%);
              background-size: 20px 20px;
              background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            }
          `}</style>

                  <img
                    src={file.preview}
                    alt="Original"
                    className="w-full h-full object-contain opacity-30"
                  />

                  <motion.img
                    src={resultImage}
                    alt="Removed BG"
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleDownload}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download PNG
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p>Built with ❤️ using AI</p>
        <p className="mt-2 text-sm">
          © {new Date().getFullYear()} Background Remover
        </p>
      </footer>
    </div>
  );
};

export default Home;
