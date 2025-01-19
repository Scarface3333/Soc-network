import React, { useState, useEffect } from 'react';
import { useSearchUsersQuery } from '../../app/services/userApi';
import { User } from '../user';
import { Input } from '@nextui-org/react';
import { Link } from 'react-router-dom';

type Props = {
    name: string;
    avatarUrl: string;
    className?: string;
};

export const UserSearch: React.FC<Props> = ({
    name,
    avatarUrl,
    className = '',
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

    // Используем хук для получения данных пользователей
    const { data: users, error, isLoading } = useSearchUsersQuery(searchValue, {
        skip: searchValue.trim() === '', // Пропускаем запрос, если searchValue пустое
    });

    useEffect(() => {
        // Обновляем filteredUsers только если searchValue не пустое и есть данные
        if (searchValue.trim() === '') {
            setFilteredUsers([]); // Очищаем, если строка поиска пустая
        } else {
            setFilteredUsers(users || []); // Обновляем, если данные доступны
        }
    }, [users, searchValue]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value); // Обновляем строку поиска
    };

    if (isLoading) return <div>Загрузка...</div>;

    if (error) {
        let errorMessage = 'Произошла ошибка';
        if ('status' in error) {
            errorMessage = `Ошибка: ${error.status}`;
        } else if ('message' in error) {
            errorMessage = `Ошибка: ${error.message}`;
        }
        return <div>{errorMessage}</div>;
    }

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <Input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Поиск пользователей..."
                className="rounded-full focus:ring-0"
            />
            {filteredUsers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg">
                    <div className="py-1">
                        {filteredUsers.map((user) => (
                            <Link
                                key={user.id}
                                to={`/Search/UserProfilePage/${user.id}`}
                                className="flex items-center px-4 py-2"
                                role="menuitem"
                            >
                                <User
                                    name={user.name || 'Неизвестный пользователь'}
                                    className="text-small font-semibold leading-non text-default-600"
                                    avatarUrl={user.avatarUrl || 'default-avatar-url.jpg'}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSearch;
