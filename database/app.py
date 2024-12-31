from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg

from datetime import datetime, timezone
from dateutil.parser import parse

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
cors = CORS(app)

connection = psycopg.connect(
    host='localhost',
    dbname='family',
    user='postgres',
    password='password')

@app.route('/publishers', methods=['GET'])
def get_publishers():
    user_id = request.args.get('UserId')  # クエリパラメータからUserIdを取得
    sql = '''
SELECT 親Id, 親パスワード,
    array_agg(
        jsonb_build_object(
            '子Id', 子Id,
            '子パスワード', 子パスワード,
            '学年', 学年
        )
    ) AS 子供
FROM 親ログイン情報 
JOIN 子ログイン情報 ON 親ログイン情報.UserId = 子ログイン情報.UserId
WHERE 親ログイン情報.UserId = %s
GROUP BY 親Id, 親パスワード;
'''

    try:
        cursor = connection.cursor()
        cursor.execute(sql, [user_id])  # プレースホルダーに値を渡す
        result = cursor.fetchall()

        # データをJSON形式に変換
        publishers = []
        for row in result:
            publishers.append({
                "親Id": row[0],
                "親パスワード": row[1],
                "子供": row[2]
            })

        cursor.close()
        return jsonify(publishers), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # エラーメッセージをログに出力
        return jsonify({"error": str(e)}), 500

@app.route('/items', methods=['GET'])
def get_items():
    filter1 = request.args.get('filter1')  # 学年フィルターを取得
    filter2 = request.args.get('filter2')  # 教科フィルターを取得
    try:
        # クエリパラメータからページ番号を取得 (デフォルトは1)
        page = int(request.args.get('page', 1))
        items_per_page = 50  # 1ページあたりの件数
        offset = (page - 1) * items_per_page

        # SQLクエリのベース
        base_query = '''
            SELECT * 
            FROM 子勉強記録
            WHERE 承認 = 'true'
        '''
        filters = []
        params = []

        # 学年フィルター
        if filter1:
            filters.append("学年 = %s")
            params.append(filter1)

        # 教科フィルター
        if filter2:
            filters.append("教科 = %s")
            params.append(filter2)

        # フィルタがあればWHERE句に追加
        if filters:
            base_query += " AND " + " AND ".join(filters)

        # 並び替えとページング
        base_query += " ORDER BY 投稿時間 DESC LIMIT %s OFFSET %s"
        params.extend([items_per_page, offset])

        # クエリ実行
        cursor = connection.cursor()
        cursor.execute(base_query, params)
        result = cursor.fetchall()

        # データをJSON形式に変換
        items = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

        cursor.close()
        return jsonify(items), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/itemsfalse', methods=['GET'])
def get_itemsfalse():
    filter = request.args.get('filter')  # フィルターを取得
    shounin = request.args.get('shounin')
    kid = request.args.get('kid')
    limit = int(request.args.get('limit', 10))  # デフォルトで10件取得
    offset = int(request.args.get('offset', 0))  # デフォルトで0から開始

    try:
        if kid != "":
            # SQLクエリの分岐
            sql = '''
            SELECT * 
            FROM 子勉強記録
            WHERE UserId = %s AND 承認 = %s AND 子Id = %s
            ORDER BY 投稿時間 DESC
            LIMIT %s OFFSET %s 
            '''
            params = (filter, shounin, kid, limit, offset)
        else:
            sql = '''
            SELECT * 
            FROM 子勉強記録
            WHERE UserId = %s AND 承認 = %s
            ORDER BY 投稿時間 DESC
            LIMIT %s OFFSET %s
            '''
            params = (filter, shounin, limit, offset)

        # クエリ実行
        cursor = connection.cursor()
        cursor.execute(sql, params)
        result = cursor.fetchall()

        # データをJSON形式に変換
        items = [dict(zip([desc[0] for desc in cursor.description], row)) for row in result]

        cursor.close()
        return jsonify(items), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@app.route('/kids_study', methods=['GET'])
def get_kids_study():
    user_id = request.args.get("UserId")#リパラメータを辞書形式に変換
    kid_id = request.args.get("kid_id")
    print(user_id)
    sql = '''
    SELECT *
    FROM 子勉強時間情報 
    WHERE UserId = %s AND 子Id = %s
    '''
    try:
        cursor = connection.cursor()
        cursor.execute(sql, (user_id, kid_id))  # プレースホルダーに値を渡す
        result = cursor.fetchall()

        # データをJSON形式に変換
        publishers = []
        for row in result:
            publishers.append({
                "UserId": row[0],
                "子Id": row[1],
                "時給": row[2],
                "お小遣い": row[3],
                "外国語": row[4],
                "数学": row[5],
                "国語": row[6],
                "理科": row[7],
                "社会": row[8],
            })

        cursor.close()
        return jsonify(publishers), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # 詳細なエラーメッセージをログに出力
        return jsonify({"error": str(e)}), 500
    

@app.route('/studynow', methods=['GET'])
def get_study():
    user_id = request.args.get("UserId")#リパラメータを辞書形式に変換
    print(user_id)
    sql = '''
    SELECT *
    FROM 子ログイン情報 
    WHERE UserId = %s 
    '''
    try:
        cursor = connection.cursor()
        cursor.execute(sql, (user_id,))  # プレースホルダーに値を渡す
        result = cursor.fetchall()

        # データをJSON形式に変換
        publishers = []
        for row in result:
            publishers.append({
                "UserId": row[0],
                "子Id": row[1],
                "学年":row[2] ,
                "子パスワード":row[3],
                "勉強中":row[4],
            })

        cursor.close()
        return jsonify(publishers), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/parents', methods=['POST'])
def post_parents():
    content = request.get_json()
    print(content)

    try:
        # SQL文を個別に分けて実行
        sql_parent = '''
        INSERT INTO 親ログイン情報 (UserId, 親Id, 親パスワード)
        VALUES (%s, %s, %s);
        '''
        cursor = connection.cursor()

        # 親ログイン情報を挿入
        cursor.execute(sql_parent, (
            content["UserId"],
            content["親Id"],
            content["親パスワード"]
        ))

        # トランザクションを確定
        connection.commit()

        # カーソルを閉じる
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 201

    except Exception as e:
        # エラーが発生した場合はロールバックしてエラー内容を返す
        connection.rollback()
        return jsonify({"error": str(e)}), 500




@app.route('/kids', methods=['POST'])
def post_kids():
    content = request.get_json()
    print(content)

    try:
       
        sql_child = '''
        INSERT INTO 子ログイン情報 (UserId, 子Id,学年,子パスワード,勉強中)
        VALUES (%s, %s,%s, %s,%s);
        '''

        sql_child_study='''
        INSERT INTO 子勉強時間情報 (UserId, 子Id ,時給,お小遣い , 外国語, 数学,  国語, 理科,社会)
        VALUES (%s, %s,%s, %s,%s, %s,%s, %s,%s);
        '''

        cursor = connection.cursor()


        # 子ログイン情報を挿入
        cursor.execute(sql_child, (
            content["UserId"],
            content["子Id"],
            content["学年"],
            content["子パスワード"],
            False,
        ))
        cursor.execute(sql_child_study, (
            content["UserId"],
            content["子Id"],
            100,
            0,
            0,
            0,
            0,
            0,
            0,
        ))
        

        # トランザクションを確定
        connection.commit()

        # カーソルを閉じる
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 201

    except Exception as e:
        # エラーが発生した場合はロールバックしてエラー内容を返す
        connection.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/study', methods=['POST'])
def post_study():
    content = request.get_json()
    print(content)

    try:
        # リクエストデータのバリデーション
        required_fields = ["UserId", "子Id", "学年", "教科", "内容", "時間", "投稿時間", "承認"]
        for field in required_fields:
            if field not in content:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # 投稿時間をISO形式の文字列からdatetimeオブジェクトに変換
        post_time = parse(content["投稿時間"])
        if post_time.tzinfo is None:
            post_time = post_time.replace(tzinfo=timezone.utc)
        else:
            post_time = post_time.astimezone(timezone.utc)

        # ミリ秒を削除してフォーマット
        post_time = post_time.strftime('%Y-%m-%d %H:%M:%S')

        sql_parent = '''
        INSERT INTO 子勉強記録(UserId, 子Id, 学年, 教科, 内容, 時間, 投稿時間, 承認)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        '''
        cursor = connection.cursor()

        # データ挿入
        cursor.execute(sql_parent, (
            content["UserId"],
            content["子Id"],
            content["学年"],
            content["教科"],
            content["内容"],
            content["時間"],
            post_time,
            content["承認"],
        ))

        # トランザクションを確定
        connection.commit()
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 201

    except Exception as e:
        connection.rollback()
        print(f"Error: {str(e)}")  # エラー内容をログに出力
        return jsonify({"error": str(e)}), 500


@app.route('/study_update', methods=['POST'])
def update_study():
    content = request.get_json()
    print(content)

    try:
        required_fields = ["UserId", "金額", "教科", "時間", "子Id", "時刻"]
        for field in required_fields:
            if field not in content:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # 投稿時間をISO形式の文字列からdatetimeオブジェクトに変換
        post_time = parse(content["時刻"])
        if post_time.tzinfo is None:
            post_time = post_time.replace(tzinfo=timezone.utc)
        else:
            post_time = post_time.astimezone(timezone.utc)

        # ミリ秒を削除してフォーマット
        post_time = post_time.strftime('%Y-%m-%d %H:%M:%S')
        print(post_time)

        # 子勉強時間情報の更新
        sql_1 = f'''
            UPDATE 子勉強時間情報
            SET お小遣い = お小遣い + %s, {content["教科"]} = {content["教科"]} + %s
            WHERE UserId=%s AND 子Id = %s;
        '''
        sql_2 = '''
            UPDATE 子勉強記録
            SET 承認 = 'true'
            WHERE UserId = %s AND 子Id = %s AND 投稿時間 = %s;
        '''
        cursor = connection.cursor()

        # 子勉強時間情報の更新クエリ実行
        cursor.execute(sql_1, (
            content["金額"],
            content["時間"],
            content["UserId"],
            content["子Id"],
        ))

        # 子勉強記録の承認更新クエリ実行
        cursor.execute(sql_2, (
            content["UserId"],
            content["子Id"],
            post_time,  # 整形された投稿時間で比較
        ))

        # トランザクションを確定
        connection.commit()
        cursor.close()

        return jsonify({'message': 'Data updated successfully'}), 200

    except Exception as e:
        connection.rollback()
        print(f"Error: {str(e)}")  # エラー内容をログに出力
        return jsonify({"error": str(e)}), 500

@app.route('/study_pay', methods=['POST'])
def post_pay():
    content = request.get_json()
    print(content)

    try:
        # SQL文を個別に分けて実行
        sql_parent = '''
        UPDATE 子勉強時間情報
            SET お小遣い = 0 
            WHERE UserId=%s AND 子Id = %s;
        '''
        cursor = connection.cursor()

        # 親ログイン情報を挿入
        cursor.execute(sql_parent, (
            content["UserId"],
            content["子Id"],
        ))

        # トランザクションを確定
        connection.commit()

        # カーソルを閉じる
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 201

    except Exception as e:
        # エラーが発生した場合はロールバックしてエラー内容を返す
        connection.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/change_pay', methods=['POST'])
def change_pay():
    content = request.get_json()
    print(content)

    try:
        # SQL文を個別に分けて実行
        sql_parent = '''
        UPDATE 子勉強時間情報
            SET 時給 = %s 
            WHERE UserId=%s AND 子Id = %s;
        '''
        cursor = connection.cursor()

        # 親ログイン情報を挿入
        cursor.execute(sql_parent, (
            content["時給"],
            content["UserId"],
            content["子Id"],
        ))

        # トランザクションを確定
        connection.commit()

        # カーソルを閉じる
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 201

    except Exception as e:
        # エラーが発生した場合はロールバックしてエラー内容を返す
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/delete_kids', methods=['POST'])
def delete_kids():
    content = request.get_json()
    print(content)

    try:
        # SQL文を個別に分けて実行
        sql_kid = '''
        DELETE FROM 子勉強時間情報
            WHERE UserId=%s AND 子Id = %s;
        '''

        sql_study='''
        DELETE FROM 子ログイン情報
            WHERE UserId=%s AND 子Id = %s;
        '''
        cursor = connection.cursor()

        # 親ログイン情報を挿入
        cursor.execute(sql_kid, (
            content["UserId"],
            content["子Id"],
        ))

        cursor.execute(sql_study, (
            content["UserId"],
            content["子Id"],
        ))

        # トランザクションを確定
        connection.commit()

        # カーソルを閉じる
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 201

    except Exception as e:
        # エラーが発生した場合はロールバックしてエラー内容を返す
        connection.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/now_kids', methods=['POST'])
def now_pay():
    content = request.get_json()
    print(content)

    try:
        # SQL文を個別に分けて実行
        sql_parent = '''
        UPDATE 子ログイン情報
            SET 勉強中 = %s 
            WHERE UserId=%s AND 子Id = %s;
        '''
        cursor = connection.cursor()

        # 親ログイン情報を挿入
        cursor.execute(sql_parent, (
            content["勉強中"],
            content["UserId"],
            content["子Id"],
        ))

        # トランザクションを確定
        connection.commit()

        # カーソルを閉じる
        cursor.close()

        return jsonify({'message': 'Data inserted successfully'}), 201

    except Exception as e:
        # エラーが発生した場合はロールバックしてエラー内容を返す
        connection.rollback()
        return jsonify({"error": str(e)}), 500