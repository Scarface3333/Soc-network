import { Navbar } from "@nextui-org/react"
import { NavButton } from "../nav-button"
import { useSelector } from "react-redux";
import { selectCurrent } from "../../features/user/userSlice";
import { BiChat, BiSearch, BiUser } from "react-icons/bi";
import { Search } from "../../pages/search";


export const Footer = () => {
  const currentUser = useSelector(selectCurrent)
  return (

    <Navbar className="mt-auto">
      <ul >
        {/* {currentUser ? (
              <NavButton href={`/users/${currentUser.id}` } >
                  <BiUser/>
                  </NavButton>
              ) : (
                <li>Пользователь не авторизован</li>
              )} */}
        {currentUser ? (
          <NavButton href={`/Search/UserProfilePage/${currentUser.id}`} >
            <BiUser />
          </NavButton>
        ) : (
          <li>Пользователь не авторизован</li>
        )}
      </ul>
      <ul >
        <NavButton href='Search' >
          <BiSearch />
        </NavButton>
      </ul>
      <ul >
        <NavButton href="/messages/:senderId/:recipientId">
          <BiChat />
        </NavButton>
      </ul>
    </Navbar>

  )
}