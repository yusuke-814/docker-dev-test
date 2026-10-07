import os
import random
import string
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel

app = FastAPI()

# CORS設定（すべてのオリジンからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベース接続関数
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
        port=os.getenv("DB_PORT", "5432"),
        cursor_factory=RealDictCursor
    )

# --- Pydanticモデル（リクエスト・レスポンスの型定義） ---

class HobbyItem(BaseModel):
    name: str
    level: int  # 1〜5の5段階

# GET: クエリパラメータやパスパラメータで user_id を受け取る場合（今回はクエリで定義例）
# ※POSTのリクエスト構造に合わせた型定義
class UserCreateRequest(BaseModel):
    user_name: str
    age: int
    hobby_list: List[HobbyItem]
    favorit_foods: List[str]

class UserCreateResponse(BaseModel):
    user_id: str

class GetUserResponse(BaseModel):
    user_name: str
    age: int
    hobby_list: List[HobbyItem]
    favorit_foods: List[str]

class UserPutRequest(BaseModel):
    user_id: str
    age: int

class UserPutResponse(BaseModel):
    user_id: str

class UserDeleteRequest(BaseModel):
    user_id: str


# --- APIエンドポイント ---

@app.get("/api/user", response_model=GetUserResponse)
def get_user(user_id: str):
    """GET: user_id をもとにユーザー情報を取得"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT user_name, age, hobby_list, favorit_foods FROM users WHERE user_id = %s;", (user_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "user_name": row["user_name"],
            "age": row["age"],
            "hobby_list": row["hobby_list"],
            "favorit_foods": row["favorit_foods"]
        }
    finally:
        cur.close()
        conn.close()

@app.post("/api/user", response_model=UserCreateResponse)
def create_user(payload: UserCreateRequest):
    """POST: 新規ユーザーを作成し、ランダムな5桁の user_id を返す"""
    # ランダムな5文字のIDを生成 (例: "fghij")
    generated_id = ''.join(random.choices(string.ascii_lowercase, k=5))
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Pydanticのモデルやリストを JSON文字列に変換して保存
        import json
        cur.execute(
            """
            INSERT INTO users (user_id, user_name, age, hobby_list, favorit_foods)
            VALUES (%s, %s, %s, %s, %s);
            """,
            (
                generated_id,
                payload.user_name,
                payload.age,
                json.dumps([h.dict() for h in payload.hobby_list]),
                json.dumps(payload.favorit_foods)
            )
        )
        conn.commit()
        return {"user_id": generated_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.put("/api/user", response_model=UserPutResponse)
def update_user(payload: UserPutRequest):
    """PUT: 指定した user_id の age を更新する"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE users SET age = %s WHERE user_id = %s RETURNING user_id;",
            (payload.age, payload.user_id)
        )
        row = cur.fetchone()
        conn.commit()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return {"user_id": row["user_id"]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.delete("/api/user")
def delete_user(payload: UserDeleteRequest):
    """DELETE: 指定した user_id のユーザーを削除する"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM users WHERE user_id = %s RETURNING user_id;", (payload.user_id,))
        row = cur.fetchone()
        conn.commit()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return {"status": "success", "deleted_user_id": row["user_id"]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()