import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { fortune } = await req.json();

    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            width: "700px",
            height: "700px",
            display: "flex",
          }}
        >
          <img
            src="https://res.cloudinary.com/dpsu7sqdk/image/upload/v1729444519/Fortune_Seer_2_ykptce.png"
            alt="Fortune Seer Card"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px",
              width: "100%",
              height: "100%",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                color: "black",
                fontWeight: "600",
                width: "300px",
                height: "400px",
              }}
            >
              {fortune}
            </p>
          </div>
        </div>
      ),
      {
        width: 700,
        height: 700,
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}
