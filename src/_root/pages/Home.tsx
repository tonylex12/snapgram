import { useEffect, useRef } from "react";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isPending,
  } = useGetPosts();

  const intObserver = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const observerCallback = (posts: IntersectionObserverEntry[]) => {
      if (posts[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    intObserver.current = new IntersectionObserver(observerCallback);

    if (lastPostRef.current) {
      intObserver.current.observe(lastPostRef.current);
    }

    return () => intObserver.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <Loader />;
  if (status === "error") return <p>Error loading posts</p>;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {posts?.pages.map((page) =>
              page?.documents.map((post: Models.Document, index: number) => {
                if (page.documents.length === index + 1) {
                  return (
                    <li key={post.$id} ref={lastPostRef}>
                      <PostCard post={post} />
                    </li>
                  );
                }
                return (
                  <li key={post.$id}>
                    <PostCard post={post} />
                  </li>
                );
              })
            )}
          </ul>
          {isFetchingNextPage && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Home;
