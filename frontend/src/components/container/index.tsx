import React from 'react'

type Props ={
    children: React.ReactElement[] | React.ReactElement
}

export const Container: React.FC<Props> = ( {children} ) => {
  return (
    <div className='flex  mx-auto mt-10 '>{children}</div>
  )
}
