import UserDetailPageClient from "./UserDetailPageClient";

export default async function UserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await params;
  const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
    cache: "no-store",
  });

  const user = await res.json();
  return <UserDetailPageClient user={{ ...user, userId }} />;
}
