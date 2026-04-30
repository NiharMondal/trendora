import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { envConfig } from "@/config/env-config";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("td_refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json(
            { success: false, message: "Missing refresh token" },
            { status: 401 },
        );
    }

    const res = await fetch(`${envConfig.backend_url}/auth/refresh-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `td_refresh_token=${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    if (data?.result?.refreshToken) {
        cookieStore.set("td_refresh_token", data.result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    return NextResponse.json(data, { status: 200 });
}
