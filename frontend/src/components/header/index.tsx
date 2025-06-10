import React, { useContext } from 'react'
import { ThemeContext } from '../theme-provider'
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, User, user } from '@nextui-org/react'
import { FaRegMoon } from 'react-icons/fa'
import { LuSunMedium } from 'react-icons/lu'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectisAuthentificated } from '../../features/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { CiLogout } from 'react-icons/ci'
import UserSearch from '../user-search'

export const Header = () => {
    const {theme, toggleTheme} = useContext(ThemeContext)
    const isAuthenticated = useSelector(selectisAuthentificated);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const handlelogout = () => {
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/auth')
  }
  
const user = {
  name: "Имя пользователя",
  avatarUrl: "https://example.com/avatar.jpg"
};

  return (
    <Navbar >
        <NavbarBrand>
        <p className="font-bold text-inherit">Network</p>
      </NavbarBrand>
      <NavbarContent justify='center'>
        <UserSearch
        name={user.name}
        avatarUrl={user.avatarUrl || ''}  
        />
        </NavbarContent>
        <NavbarContent justify='end'>
            <NavbarItem
             className='lg:flex rext-3x1 cursor-pointer'
             onClick={() => toggleTheme ()}
             >
                { theme === 'light' ? <FaRegMoon/> : <LuSunMedium/> }
            </NavbarItem>
            <NavbarItem>
                {
                  isAuthenticated && (
                    <Button
                    color='default'
                    variant='flat'
                    className='gap-2'
                    onClick={handlelogout}
                    >
                      <CiLogout/> <span>Выйти</span>

                    </Button>
                  )
                }
            </NavbarItem>
        </NavbarContent>
    </Navbar>
  )
}
