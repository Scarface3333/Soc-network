import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.css"
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Auth } from "./pages/auth"
import { Layout } from "./components/layout"
import { Posts } from "./components/posts"
import { UserProfile } from "./components/user-profile"
import { CurrentPost } from "./components/current-post"
import { Followers } from "./components/followers"
import { Following } from "./components/following"
import { AuthGuard } from "./features/user/authGuard"
import { Search } from "./pages/search"
import UserProfilePage from "./pages/user-profile-page"
import MessagePage from "./pages/message"


const container = document.getElementById("root")

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      // {
      //   path: "",
      //   element: <Posts />
      // },
      {
        path: "posts/:id",
        element: <CurrentPost />
      },
      // {
      //   path: "users/:userId",
      //   element: <UserProfile/>
      // },
      {
        path: "Search/UserProfilePage/:id/Followers",
        element: <Followers />
      },
      {
        path: "Search/UserProfilePage/:id/Following",
        element: <Following />
      },
      {
        path: "Search/UserProfilePage/:id",
        element: <UserProfilePage />,
        
      },
      {
        path: "Search",
        element: <Search />
      },
      {
        path: '/messages/:senderId/:recipientId',
        element: <MessagePage />
      }

    ]
  }
])

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <NextUIProvider>
          <ThemeProvider>
            <AuthGuard>

              <RouterProvider router={router} />
            </AuthGuard>
          </ThemeProvider>
        </NextUIProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
