import UserSearch from "../../components/user-search"

export const Search = () => {

  const user = {
    name: "Имя пользователя",
    avatarUrl: "https://example.com/avatar.jpg"
  };
  return (
    <div className="flex w-60">
      <UserSearch
        name={user.name}
        avatarUrl={user.avatarUrl || ''} />
    </div>
  )
}