const searchModule = (() => {
    const port = 80;
    const BASE_URL = `http://54.168.239.119:${port}/api/v1/search`;

    return {
        searchUsers: async () => {
            // 入力値を取得
            const qurey = document.getElementById('search').value;

            const res = await fetch(BASE_URL + '?q=' + qurey);
            const result = await res.json();

            let body = "";

            for(const key in result) {
                const user = result[key];
                body += `<tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.profile}</td>
                                <td>${user.date_of_birth}</td>
                                <td></td>
                                <td>${user.created_at}</td>
                                <td>${user.updated_at}</td>
                                <td><a href="edit.html?uid=${user.id}">編集</a></td>
                                </tr>`;
            } 
            document.getElementById("users-table").innerHTML = body;
        }
    }
})();