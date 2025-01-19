import React from 'react'

type Props = {
    count: number;
    title: string;
  
}

export const CountInfo: React.FC<Props> = ({
    count,
    title,
    
}) => {
  return (
      <div className="flex flex-col items-center justify-center  " > 
          <span className="text-4xl font-semibold leading-none">{count}</span>
          <span className='text-sm'>{title}</span>
    </div>
  )
}
