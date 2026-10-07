import type {
    GetUserResponse,
    CreateUserPayload,
    CreateUserResponse,
    UpdateUserAgePayload,
    DeleteUserPayload,
} from '../types/API';

const API_BASE = "http://localhost:8000/api";

// 1. GET 処理
export async function getUser(userId: string): Promise<GetUserResponse> {
    const res = await fetch(`${API_BASE}/user?user_id=${userId}`);

    if (!res.ok) {
        throw new Error('GETリクエストに失敗しました');
    }

    return await res.json();
}

// 2. POST 処理
export async function createUser(
    Payload: CreateUserPayload
): Promise<CreateUserResponse> {
    const res = await fetch(`${API_BASE}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Payload),
    });

    if (!res.ok) {
        throw new Error('POSTリクエストに失敗しました');
    }

    return await res.json();
}

// 3. PUT 処理
export async function updateUserAge(
    Payload: UpdateUserAgePayload
) {
    const res = await fetch(`${API_BASE}/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Payload),
    });

    if (!res.ok) {
        throw new Error('PUTリクエストに失敗しました');
    }

    return await res.json();
}

// 4. DELETE 処理
export async function deleteUser(
    Payload: DeleteUserPayload
) {
    const res = await fetch(`${API_BASE}/user`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Payload),
    });

    if (!res.ok) {
        throw new Error('DELETEリクエストに失敗しました');
    }

    return await res.json();
}