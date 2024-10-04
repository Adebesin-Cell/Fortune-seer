import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiCoffeeBold } from "react-icons/pi";

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
      // const response = await axios.get(
      //   `/api/generateFortune?username=${username}`
      // );
      // console.log(response);
      // setFortune(response.data);
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
    <div className="relative flex flex-col items-center py-20 h-screen bg-[#fab5e1] px-4">
      {/* White circle */}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-2 rounded">{error}</div>
      )}

      <div className="w-full h-full z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center ">
          <h1 className="mb-4 text-2xl font-bold">
            Have a Peek Into Your Fortune 🔮
          </h1>
          <Input
            placeholder="Enter your GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="mb-4 text-black"
          />
        </div>
        <div className={`${!isCracked ? "" : "w-full"}`}>
          {!isCracked ? (
            <Image
              src="/whole.png"
              alt="Fortune Cookie "
              className="w-64 h-64"
              width={100}
              height={100}
            />
          ) : (
            <div className="flex  w-full flex-col items-center justify-center">
              <motion.div
                className=" flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  initial={{ rotate: 0, x: 0 }}
                  animate={{ rotate: -45, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className=" left-0"
                >
                  <Image
                    src="/left-side.png"
                    alt="Left Half"
                    width={100}
                    height={100}
                  />
                </motion.div>

                <motion.div
                  initial={{ rotate: 0, x: 0 }}
                  animate={{ rotate: 45, x: 50 }}
                  transition={{ duration: 0.5 }}
                  className=" right-0"
                >
                  <Image
                    src="/right-side.png"
                    alt="Right Half"
                    width={100}
                    height={100}
                  />
                </motion.div>
              </motion.div>

              <div className="bg-white p-4 w-[50%] md:w-[30%]  shadow-md rounded-md">
                <p className=" text-lg text-black transform ">{fortune}</p>
              </div>
            </div>
          )}
        </div>

        {!isCracked ? (
          <Button onClick={handleSubmit} disabled={isLoading} className="mt-4">
            {isLoading ? "Loading..." : "Take A Peek 🫣"}
          </Button>
        ) : (
          <Button onClick={reset} className="mt-4 ">
            Try Again
          </Button>
        )}
      </div>

      <footer className="absolute bottom-4 flex flex-col md:flex-row items-center gap-6  text-white text-center">
        <p>
          Created by{" "}
          <a
            href="https://github.com/oleanjikingcode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400"
          >
            OleanjiKingCode
          </a>
        </p>
        <a
          href="https://buymeacoffee.com/oleanji"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white flex items-center hover:text-yellow-400"
        >
          Buy me a coffee
          <PiCoffeeBold className="w-6 h-6 ml-2" />
        </a>
      </footer>
    </div>
  );
}
