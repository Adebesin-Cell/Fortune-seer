import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiCoffeeBold } from "react-icons/pi";
import { GrPowerReset } from "react-icons/gr";
import { FaXTwitter } from "react-icons/fa6";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { RiLoader5Fill } from "react-icons/ri";
import { toast } from "sonner";
import {
  downloadImage,
  FortunePromptType,
  shareToTwitter,
  uploadToCloudinary,
} from "@/utils";
import { SpinnerIcons } from "@/components/ui/spinner";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isCracked, setIsCracked] = useState(false);
  const [fortune, setFortune] = useState("dmflkvmqkemerk");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);

    if (!username.trim()) {
      toast.error("Please enter a GitHub username.", { duration: 5000 });
      setIsLoading(false);
      return;
    }

    try {
      toast(
        <div className=" flex items-center gap-2 ">
          <SpinnerIcons /> <span>Loading Wisdom...</span>
        </div>,
        {
          id: "fortune-generation",
        }
      );

      const response = await axios.get(`/api/generateFortune`, {
        params: {
          username: username,
          promptType: prompt,
        },
      });

      setFortune(response.data);
      setIsCracked(true);
      toast.dismiss("fortune-generation");
    } catch (err) {
      toast.error("Failed to generate fortune. Please try again.", {
        duration: 5000,
      });
      toast.dismiss("fortune-generation");
      console.error(err);
    } finally {
      toast.dismiss("fortune-generation");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isCracked)
      uploadToCloudinary({ fortune, username, updateImageUrl: setImageUrl });
  }, [isCracked]);

  const reset = () => {
    setUsername("");
    setIsCracked(false);
    setFortune("");
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-20 min-h-screen bg-[#1a1a1a] px-4 overflow-hidden">
      <div className="w-full h-full z-10 flex flex-col items-center justify-center mb-20">
        <div className="flex flex-col items-center justify-center text-center text-white dark:text-white ">
          <h1 className="mb-4 text-2xl font-bold">
            Peek into the Master’s Wisdom 🔥
          </h1>
          <Input
            placeholder="Enter your GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="mb-4 text-white dark:text-white"
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

              <div className="relative w-[700px] h-[700px] flex flex-col-reverse">
                <Image
                  src="/template.png"
                  alt="Fortune Seer Card"
                  layout="fill"
                  objectFit="contain"
                />
                <div className="absolute inset-0 flex justify-center items-center px-4 ">
                  <p className="text-center text-lg text-black font-semibold w-[300px] h-[400px] ">
                    {fortune || "Your Fortune Awaits..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isCracked ? (
          <div className="flex flex-col md:flex-row  md:gap-5 items-center justify-center  w-full">
            <Button
              onClick={() => handleSubmit(FortunePromptType.JOB_ADVICE)}
              disabled={isLoading}
              className="mt-4 text-white dark:text-white"
              variant="outline"
            >
              {/* {isLoading && (
                <RiLoader5Fill className="animate-spin w-6 h-6 self-center duration-700" />
              )}{" "} */}
              Job Advice From the Stars 🌟
            </Button>
            <Button
              onClick={() => handleSubmit(FortunePromptType.SKILL_IMPROVEMENT)}
              disabled={isLoading}
              className="mt-4 text-white dark:text-white"
              variant="outline"
            >
              {/* {isLoading && (
                <RiLoader5Fill className="animate-spin w-6 h-6 self-center duration-700" />
              )}{" "} */}
              Skill Improvement Advice 🚀
            </Button>
            <Button
              onClick={() => handleSubmit(FortunePromptType.MYSTICAL_ROAST)}
              disabled={isLoading}
              className="mt-4  text-white dark:text-white"
              variant="outline"
            >
              {/* {isLoading && (
                <RiLoader5Fill className="animate-spin w-6 h-6 self-center duration-700" />
              )}{" "} */}
              Get a Mystical Roast 🍀
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row  md:gap-5 items-center justify-center  w-full">
            <Button
              onClick={() =>
                downloadImage({
                  downloadLoader: setDownloadIsLoading,
                  imageUrl,
                })
              }
              className="mt-4 gap-2 shadow-sm shadow-black"
            >
              {downloadIsLoading ? (
                <RiLoader5Fill className="animate-spin w-6 h-6 self-center duration-700" />
              ) : (
                <AiOutlineCloudDownload />
              )}{" "}
              <span>Download Image </span>
            </Button>
            <Button
              onClick={() => shareToTwitter({ imageUrl })}
              className="mt-4 gap-2 shadow-sm shadow-black"
            >
              <FaXTwitter /> <span>Share on Twitter</span>
            </Button>

            <Button
              onClick={reset}
              className="mt-4 gap-2 shadow-sm shadow-black"
            >
              <GrPowerReset /> <span>Try Again</span>
            </Button>
          </div>
        )}
      </div>

      <footer className="absolute bottom-4  flex flex-col md:flex-row items-center gap-6  text-white text-center">
        <p>
          Created by{" "}
          <a
            href="https://github.com/oleanjikingcode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#ababab]"
          >
            OleanjiKingCode
          </a>
        </p>
        <a
          href="https://buymeacoffee.com/oleanji"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white flex items-center hover:text-[#ababab]"
        >
          Buy me a coffee
          <PiCoffeeBold className="w-6 h-6 ml-2" />
        </a>
      </footer>
    </div>
  );
}
