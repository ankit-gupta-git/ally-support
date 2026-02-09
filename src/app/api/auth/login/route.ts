import { NextRequest, NextResponse } from "next/server";
import { scalekit } from "@/lib/scalekit";

export async function GET(req:NextRequest) {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
    const url = scalekit.getAuthorizationUrl(redirectUri);
    console.log(url)
    return NextResponse.redirect(url);
} 