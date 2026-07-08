import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const answer = normalize(body.answer);

    const expected = normalize(process.env.DISHU_BOOK_PASSCODE || "Dishu");

    if (answer !== expected) {
      return NextResponse.json(
        {
          ok: false,
          message: "That is not the answer. Try again with your buddy name."
        },
        { status: 401 }
      );
    }

    cookies().set("dishu_book_opened", "yes", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return NextResponse.json({
      ok: true,
      message: "The book is open."
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Something went wrong while opening the book."
      },
      { status: 500 }
    );
  }
}
