const usersModule = (() => {
    const port = 80;
    const BASE_URL = `http://54.168.239.119:${port}/api/v1/users`;

    // header
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    const handleError = async (res) => {
        const resJson = await res.json();
        console.log(res.status);
        switch(res.status) {
            case 200:
                alert(resJson.message);
                window.location.href = "/";
                break;
            case 201:
                alert(resJson.message);
                window.location.href = "/";
                break;
            case 400:
                alert(resJson.message);
                break;
            case 404:
                alert(resJson.error);
                break;
             case 500:
                alert(resJson.error);
                break;
            default:
                alert("system error!");
                window.location.href = "/";
                break;
        }
    }

    return {
        // objectとして返す場合は{ key:value }として記述
        fechAllUsers: async () => {
            const res = await fetch(BASE_URL);
            const users = await res.json();

            for(let i = 0; i < users.length; i++) {
                const user = users[i];

                const res2 = await fetch(BASE_URL + `/${user.id}/followers`);
                const followers = await res2.json();
                let followersList = '';
                console.log(followers);
                for(key in followers) {
                    if(followersList != "") { followersList += ', '; }
                    followersList += followers[key].name;
                }

                const body = `<tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.profile}</td>
                                <td>${user.date_of_birth}</td>
                                <td>${followersList}</td>
                                <td>${user.created_at}</td>
                                <td>${user.updated_at}</td>
                                <td><a href="edit.html?uid=${user.id}">編集</a></td>
                                </tr>`;
                document.getElementById('users-table').insertAdjacentHTML("beforeend", body);
            }
        },

        // 新規ユーザーの作成メソッド
        createUser: async() => {
            const name = document.getElementById("name").value;
            const profile = document.getElementById("profile").value;
            const dateOfBirth = document.getElementById("date-of-birth").value;

            // body
            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth
            }

            // リクエストを投げる
            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: headers,
                // JSONに変換
                body: JSON.stringify(body)
            })
            return handleError(res);
        },

        // 特定のユーザー情報を読み込む
        setExistingValue: async (uid) => {
            const res = await fetch(BASE_URL + '/' + uid);
            const resJson = await res.json();

            document.getElementById("uid").value = uid;
            document.getElementById("name").value = resJson.name;
            document.getElementById("profile").value = resJson.profile;
            document.getElementById("date-of-birth").value = resJson.date_of_birth;

        },

        // ユーザー情報更新のメソッド
        saveUser: async(uid) => {
            const name = document.getElementById("name").value;
            const profile = document.getElementById("profile").value;
            const dateOfBirth = document.getElementById("date-of-birth").value;

            // body
            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth
            }

            // リクエストを投げる
            const res = await fetch(BASE_URL + '/' + uid, {
                method: "PUT",
                headers: headers,
                // JSONに変換
                body: JSON.stringify(body)
            })
            return handleError(res);
        },

        deleteUser: async (uid) => {
            const ret = window.confirm('このユーザーを削除しますか？');
            if(!ret) {
                return false
            } else {
                // リクエストを投げる
                const res = await fetch(BASE_URL + '/' + uid, {
                    method: "DELETE",
                    headers: headers
                })
                return handleError(res);
            }
        }

    }
})();