import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

export default function Home() {
  const session = useSession();

  const apiUtils = api.useUtils();

  const [postInput, setPostInput] = useState<string>("");

  const { mutate } = api.post.create.useMutation({
    onSettled: async () => {
      return await apiUtils.post.getAll.invalidate();
    },
  });
  const { data: posts } = api.post.getAll.useQuery();

  const handleUpload = () => {
    mutate({
      content: postInput,
    });
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="mb-10 border-b-2 p-4 text-center text-[2rem] font-semibold">
        Throttling user actions
      </header>
      <main className="flex flex-col items-center justify-center">
        <div className="container flex max-w-screen-md flex-col gap-6">
          {session.data ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-center font-semibold">
                Signed in as {session.data.user.name}
              </p>
              <Button variant="destructive" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button onClick={() => signIn("discord")}>
              Sign in using Discord
            </Button>
          )}
          <div>
            <div className="flex gap-4">
              <Input onChange={(e) => setPostInput(e.target.value)} id="post" />
              <Button onClick={handleUpload}>Post</Button>
            </div>
            <ul className="mt-4 list-inside list-disc">
              {posts?.map((post) => {
                return <li key={post.id}>{post.content}</li>;
              })}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
