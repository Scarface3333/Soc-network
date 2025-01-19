
import { useGetUserByIdQuery } from "../../app/services/userApi";
import { Posts } from "../../components/posts"
import { UserProfile } from "../../components/user-profile"

import { Outlet, useParams } from "react-router-dom"


export const UserProfilePage = () => {

 
  const { id } = useParams<{ id: string }>();
  

  return (
    <div>
      <UserProfile id={id || 'defaultUserId'} />
      <Posts id={id || 'PostDef'}  />
      <Outlet/>
    </div>
  )
}

export default UserProfilePage