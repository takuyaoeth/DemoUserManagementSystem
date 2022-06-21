const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const path = require("path");
const bodyParser = require("body-parser");

const dbPath = "app/db/database.sqlite3";

// リクエストのbodyをパースする設定
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// publicディレクトリを静的ファイルのルートディレクトリ
app.use(express.static(path.join(__dirname, 'public')));

///////// GET //////////

// 全ユーザーを取得
app.get('/api/v1/users', (req, res) => {
    const db = new sqlite3.Database(dbPath);

    db.all("select * from users", (err, rows) => {
        res.json(rows);
    });

    db.close();
});

// フォローしているユーザーリストの取得
app.get('/api/v1/users/:id/following', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;

    db.all(`select * from following left join users on following.followed_id = users.id where following.following_id = ${id}`, (err, rows) => {
        res.json(rows);
    });

    db.close();
});

// フォロワーリストの取得
app.get('/api/v1/users/:id/followers', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;

    db.all(`select * from following left join users on following.following_id = users.id where following.followed_id = ${id}`, (err, rows) => {
        res.json(rows);
    });

    db.close();
});

// フォローしているユーザー情報の取得
app.get('/api/v1/users/:id/following/:followed_id', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;
    const followed_id = req.params.followed_id;

    db.get(`select * from following left join users on following.followed_id = users.id where following.following_id = ${id} and users.id = ${followed_id}`, (err, rows) => {
        res.json(rows);
    });

    db.close();
});

// フォロワーのユーザー情報の取得
app.get('/api/v1/users/:id/followers/:followed_id', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;
    const followed_id = req.params.followed_id;

    db.get(`select * from following left join users on following.following_id = users.id where following.followed_id = ${id} and users.id = ${followed_id}`, (err, rows) => {
        res.json(rows);
    });

    db.close();
});


// 特定ユーザーのみ取得
app.get('/api/v1/users/:id', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;

    db.get(`select * from users where id =  ${id}`, (err, row) => {
        if(!row) {
            res.status(404).send({ message: "指定されたユーザーがいません" })
        }else {
            res.status(200).json(row);
        }
    });

    db.close();
});

// 検索した文字列が名前に含まれるユーザーのみ取得
app.get('/api/v1/search', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const keyword = req.query.q;

    db.all(`select * from users where name like "%${keyword}%"`, (err, rows) => {
        res.json(rows);
    });

    db.close();
});

///////// POST, PUT, DELETE //////////

// クエリを実行する
const run = async (sql, db) => {
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if(err) {
                return reject(err);
            } else {
                return resolve();
            }
        })
    });
}

// 新規ユーザーの作成
app.post('/api/v1/users', async (req, res) => {
    if(!req.body.name || req.body.name === "") {
        res.status(400).send({message: "ユーザー名が指定されていません"});
    } else {
        const db = new sqlite3.Database(dbPath);

        const name = req.body.name;
        const profile = req.body.profile ? req.body.profile : "";
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";
        const sql = `insert into users (name, profile, date_of_birth) values ("${name}", "${profile}", "${dateOfBirth}");`;
        try {
            await run(sql, db);
            res.status(201).send( { message: "新規ユーザーを作成しました" } )
        } catch (e) {
            res.status(500).send({ error: e });
        }
        db.close;
    }
});

// フォローする
app.post('/api/v1/users/:id/following/:followed_id', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;
    const followed_id = req.params.followed_id;

    db.get(`select * from users where id =  ${id}`, async (err, row) => {
        if(!row) {
            res.status(404).send({ message: "指定されたユーザーがいません" })
        }else {
            const sql = `insert into following (following_id, followed_id) values ("${id}", "${followed_id}");`;
            try {
                await run(sql, db);
                res.status(201).send( { message: `${id}が${followed_id}をフォローしました` } )
            } catch (e) {
                res.status(500).send({ error: e });
            }
        }
    });
    db.close;
});

// ユーザー情報の更新
app.put('/api/v1/users/:id', async (req, res) => {
    if(!req.body.name || req.body.name === "") {
        res.status(400).send({message: "ユーザー名が指定されていません"});
    } else { 
        const db = new sqlite3.Database(dbPath)
        const id = req.params.id

        // 現在のユーザー情報を取得
        db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
            if(!row) {
                res.status(404).send({ message: "指定されたユーザーがいません" });
            } else {
                // 値が空の場合は既存データを入れる
                const name = req.body.name ? req.body.name : row.name
                const profile = req.body.profile ? req.body.profile : row.profile
                const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
                const sql = `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`;

                try {
                    await run(sql, db);
                    res.status(200).send({ message: "ユーザー情報の更新が完了しました" });
                } catch (e) {
                    res.status(500).send({ error: e });
                }
            }
        })
        db.close()
    }
})

// ユーザー情報の削除
app.delete('/api/v1/users/:id', async (req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    // 現在のユーザー情報を取得
    db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
        if(!row) {
            res.status(404).send({ message: "指定されたユーザーが見つかりません" });
        } else {
            // ユーザー情報を削除する
            const sql = `delete from users where id=${id}`;
            try {
                await run(sql, db);
                res.status(200).send({ message: "ユーザーを削除しました" });
            } catch (e) {
                res.status(500).send({ error: e });
            }           
        }
    });
    db.close()
})

// フォロー解除
app.delete('/api/v1/users/:id/following/:followed_id', async (req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id;
    const followed_id = req.params.followed_id;

    // 現在のユーザー情報を取得
    db.get(`SELECT * FROM following WHERE following_id=${id} AND followed_id=${followed_id}`, async (err, row) => {
        if(!row) {
            res.status(404).send({ message: "指定されたユーザーが見つかりません" });
        } else {
            // ユーザー情報を削除する
            const sql = `delete from following where following_id=${id} AND followed_id=${followed_id}`;
            try {
                await run(sql, db);
                res.status(200).send({ message: "フォローを解除しました" });
            } catch (e) {
                res.status(500).send({ error: e });
            }           
        }
    });
    db.close()
})


const port = process.env.PORT || 80;
app.listen(port);
console.log("Listen on port: " + port);