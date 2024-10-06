import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { text } = await req.json();

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 35,
          color: "black",
          background: "white",
          borderRadius: "20px",
          width: "100%",
          height: "100%",
          padding: "50px 100px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          border: "10px solid #000",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.4)",
        }}
      >
        {text || "Your Fortune Awaits..."}
      </div>
    ),
    {
      width: 500,
      height: 700,
    }
  );
}
