# ベースイメージを指定
FROM python:3.14
# 作業ディレクトリを作成
WORKDIR /app
# 必要なパッケージをインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# アプリケーションのソースコードをコピー
COPY . .
# コンテナが内部で使用し、外部に公開するポート番号（FastAPIのデフォルトである8000）を指定
EXPOSE 8000
# アプリケーションを起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]