import React from 'react'
import { Button } from '../button';
import { Link } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
    
  href: string;
    
}

export const NavButton: React.FC<Props> = ({
  children,
  
  href
}) => {
  return (
    
    <Button className='flex justify-start text-xl w-full' >
      <Link to= { href }>
        { children }
      </Link>
    </Button>
  )
}
