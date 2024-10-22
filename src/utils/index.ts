import axios from "axios";

export const FortunePromptType = {
  JOB_ADVICE: "job_advice",
  SKILL_IMPROVEMENT: "skill_improvement",
  MYSTICAL_ROAST: "mystical_roast",
};

export const uploadToCloudinary = async ({
  fortune,
  username,
  updateImageUrl,
}: {
  fortune: string;
  username: string;
  updateImageUrl: (url: string) => void;
}) => {
  try {
    const response = await axios.post(
      "/api/og",
      { fortune },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "image/png" });
    const cloudName = process.env.CLOUDINARY_API_KEY ?? "dpsu7sqdk";

    const formData = new FormData();
    formData.append("file", blob, `${username}'s fortune`);
    formData.append("upload_preset", "fortune");

    // Upload to Cloudinary
    const cloudinaryResponse = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const imageUrl = cloudinaryResponse.data.secure_url;
    updateImageUrl(imageUrl);
  } catch (error) {
    console.log(error);
  }
};

export const downloadImage = async ({
  downloadLoader,
  imageUrl,
}: {
  downloadLoader: (loader: boolean) => void;
  imageUrl: string;
}) => {
  try {
    downloadLoader(true);

    // Download the uploaded image
    const downloadResponse = await axios.get(imageUrl, {
      responseType: "blob",
    });

    const downloadLink = document.createElement("a");
    const url = window.URL.createObjectURL(downloadResponse.data);
    downloadLink.href = url;
    downloadLink.setAttribute("download", "magic-card.png");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error("Error uploading or downloading image:", error);
  } finally {
    downloadLoader(false);
  }
};

export const shareToTwitter = (props: { imageUrl: string }) => {
  const tweetText = `Check out this magical fortune card I generated! 🧙‍♂️✨`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(props.imageUrl)}`;
  window.open(twitterUrl, "_blank");
};


export const statuses = [
    'Getting user GitHub info...',
    'Loading Wisdom...',
    'Bringing insight to light...',
    'Almost there... Master is thinking...',
  ];