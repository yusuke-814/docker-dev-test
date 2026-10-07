export interface HobbyItem {
    name: string;
    level: number;
}

export interface GetUserResponse {
    user_name: string;
    age: number;
    hobby_list: HobbyItem[];
    favorite_foods: string[];
}

export interface CreateUserPayload {
    user_name: string;
    age: number;
    hobby_list: HobbyItem[];
    favorite_foods: string[];
} 

export interface CreateUserResponse {
    user_id: string;
}

export interface UpdateUserAgePayload {
    user_id: string;
    age: number;
}

export interface DeleteUserPayload {
    user_id: string;
}