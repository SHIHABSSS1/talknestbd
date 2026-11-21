import type { Metadata } from "next";
import { MyAudiobooks } from "@/components/account/MyAudiobooks";

export const instant = false;

export const metadata: Metadata = {
  title: "My Audiobooks",
};

export default function AccountAudiobooksPage() {
  return <MyAudiobooks />;
}
