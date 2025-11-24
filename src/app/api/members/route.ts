import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { createMember, getMembers } from "@/lib/members";
import { memberSchema } from "@/lib/validation";

export async function GET() {
  const members = await getMembers();
  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await request.json();
  const parsed = memberSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join(", ") },
      { status: 400 },
    );
  }

  try {
    const member = await createMember(parsed.data);
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to save member." },
      { status: 500 },
    );
  }
}

