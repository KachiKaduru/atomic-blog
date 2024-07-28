import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1. CREATING THE CONTEXT. Here it is called PostContext
// because what we're passsing are mainly about posts. It can
// have any other name.
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() => Array.from({ length: 30 }, () => createRandomPost()));
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  // 2. ADDING THE VALUE TO THE CONTEXT. The value here are the props that
  // would be passed around, so we store them in an object here
  // which is the Value in the case of the Context.
  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {/*   //3. CONSUMING THE CONTEXT. Here, we use the PostContext by
  // calling the useContext hook from React. Then we destructure
  // the object coming from the useContext call and get the prop
  // that we need in that component instance. */}
      {children}
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);

  //this is to prevent someone from using the PostProivder
  // outside of it or its children.
  if (context === undefined) throw new Error("PostContext was used outside of PostProvider");
  return context;
}

export { PostProvider, usePosts };
