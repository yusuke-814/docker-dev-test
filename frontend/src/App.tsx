import { useState } from 'react';
import {
  getUser,
  createUser,
  updateUserAge,
  deleteUser,
} from './api/userApi';

import type {
  CreateUserPayload,
  DeleteUserPayload,
  UpdateUserAgePayload,
} from './types/API';

export function App() {
  const [responseLog, setResponseLog] = useState<string>("結果がここに表示されます");

  // 1. GET 処理
  const handleGet = async () => {
    try {
      const targetUserId = 'abcde';  // テスト用ID
      
      const data = await getUser(targetUserId);

      setResponseLog(JSON.stringify(data, null, 2));  // レスポンスを整形して表示
    } catch (err: any) {
      setResponseLog(`Error: ${err.message}`);
    }
  };

  // 2. POST 処理
  const handlePost = async () => {
    try {
      const payload: CreateUserPayload = {
        user_name: 'Jerry',
        age: 21,
        hobby_list: [
          { name: 'tennis', level: 2 },
          { name: 'baseball', level: 5 },
          { name: 'igo', level: 2 },
          { name: 'training', level: 3 },
        ],
        favorite_foods: ['pasta', 'fish'],
      };

      const data = await createUser(payload);

      setResponseLog(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseLog(`Error: ${err.message}`);
    }
  };

  // 3. PUT 処理
  const handlePut = async () => {
    try {
      const payload: UpdateUserAgePayload = {
        user_id: 'abcde',  // テスト用ID
        age: 26,
      };

      const data = await updateUserAge(payload);

      setResponseLog(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseLog(`Error: ${err.message}`);
    }
  };

  // 4. DELETE 処理
  const handleDelete = async () => {
    try {
      const payload: DeleteUserPayload = {
        user_id: 'abcde',  // テスト用ID
      };

      const data = await deleteUser(payload);

      setResponseLog(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseLog(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>API 疎通確認パネル</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={handleGet} style={{ padding: '0.5rem 1rem' }}>GET</button>
        <button onClick={handlePost} style={{ padding: '0.5rem 1rem' }}>POST</button>
        <button onClick={handlePut} style={{ padding: '0.5rem 1rem' }}>PUT</button>
        <button onClick={handleDelete} style={{ padding: '0.5rem 1rem' }}>DELETE</button>
      </div>
      <h2>レスポンス結果:</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px', minHeight: '100px' }}>
        {responseLog}
      </pre>
    </div>
  );
}

export default App;