import { Card, CardBody, Tab, Tabs } from '@nextui-org/react'
import React, { useState } from 'react'

import { Register } from '../../features/user/register'
import { Login } from '../../features/user/login'

export const Auth = () => {
  const [selected, setSelectd] = useState('login')
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="flex-col">
        <Card className='max-w-full w-[340px] h-[450px]'>
          <CardBody className='overflow-hidden'>
            <Tabs
            fullWidth
            size='md'
            selectedKey={selected}
            onSelectionChange={(key) => setSelectd(key as string)}
            >
              <Tab key="login" title = 'Вход'>
                <Login setSelected={setSelectd}/>
              </Tab>
              <Tab key="sign-up" title = 'Регистрация'>
              <Register setSelected={setSelectd}/>
              </Tab>
            </Tabs>
              
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
