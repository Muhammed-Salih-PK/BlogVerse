import { cookies } from "next/headers";

export default function ProfileLayout({ children }) {
  return <>{children}</>;
}

export async function generateMetadata() {
  // You must use absolute URL when fetching server-side
  

  const { user } = await getProfileData();

  return {
    title: `${user?.username} Profile | BlogPress`,
    robots: "noindex, follow",
    description: `Browse all articles tagged with ${user.bio}`,
  };
}

export async function getProfileData() {
  const cookieStore = await cookies();
  // <-- gets server cookies
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
    headers: {
      Cookie: cookieStore.toString(), // attach auth cookies
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
