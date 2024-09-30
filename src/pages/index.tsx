import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isCracked, setIsCracked] = useState(false);
  const [fortune, setFortune] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setFortune("");

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `/api/generateFortune?username=${username}`
      );
      setFortune(response.data.fortune);
      setIsCracked(true);
    } catch (err) {
      setError("Failed to generate fortune. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setUsername("");
    setIsCracked(false);
    setFortune("");
    setError("");
  };

  return (
    <div className="relative flex flex-col items-center py-20 min-h-screen bg-[#fab5e1] px-4">
      {/* White circle */}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-2 rounded">{error}</div>
      )}

      <div className="relative z-10 flex items-center justify-center">
        {!isCracked ? (
          <div className="p-4 rounded flex flex-col items-center justify-center">
            <Image
              src="/whole.png"
              alt="Fortune Cookie "
              className="w-64 h-64"
              width={100}
              height={100}
            />

            <h1 className="mb-4 text-2xl font-bold">
              Have a Peek Into Your Fortune🥠 🔮
            </h1>
            <Input
              placeholder="Enter your GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="mb-4 text-black"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? (
                "Loading..."
              ) : (
               "Take A Peek 🫣"
              )}
            </Button>
          </div>
        ) : (
          <div className="relative">
            {/* Cracked fortune cookie animation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Left half of the cracked cookie */}
              <motion.div
                initial={{ rotate: 0, x: 0 }}
                animate={{ rotate: -45, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute left-0"
              >
                <Image
                  src="/left-side.png"
                  alt="Left Half"
                  width={150}
                  height={150}
                />
              </motion.div>
              {/* Right half of the cracked cookie */}
              <motion.div
                initial={{ rotate: 0, x: 0 }}
                animate={{ rotate: 45, x: 50 }}
                transition={{ duration: 0.5 }}
                className="absolute right-0"
              >
                <Image
                  src="/images/right-side.png"
                  alt="Right Half"
                  width={150}
                  height={150}
                />
              </motion.div>

              {/* Fortune text displayed on a white strip */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white px-4 py-2 shadow-md rounded">
                  <p className="text-center text-lg">{fortune}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Reset button to enter a new username */}
            <Button
              onClick={reset}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
