import type { Metadata } from "next";
import { MyReviews } from "@/components/account/MyReviews";

export const instant = false;

export const metadata: Metadata = {
  title: "My Reviews",
};

export default function AccountReviewsPage() {
  return <MyReviews />;
}
