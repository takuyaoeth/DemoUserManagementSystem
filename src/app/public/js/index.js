const indexModule = (() => {
    const path = window.location.pathname;

    switch(path) {
        case '/':
            // 検索ボタンを押したときのアクション
            document.getElementById("search-button")
            .addEventListener("click", () => {
                return searchModule.searchUsers();
            });
            return usersModule.fechAllUsers();

        case '/create.html':
            // 保存ボタンを押したときのアクション
            document.getElementById("save-button")
            .addEventListener("click", () => {
                return usersModule.createUser();
            });
            // キャンセルボタンを押したときのアクション
            document.getElementById("cancel-button")
            .addEventListener("click", () => {
                window.location.href = "/";
            });
            break;
        case '/edit.html':
            const uid = window.location.search.split("?uid=")[1];

            // 保存ボタンを押したときのアクション
            document.getElementById("save-button")
            .addEventListener("click", () => {
                return usersModule.saveUser(uid);
            });
            // キャンセルボタンを押したときのアクション
            document.getElementById("cancel-button")
            .addEventListener("click", () => {
                window.location.href = "/";
            });
            // 削除ボタンを押したときのアクション
            document.getElementById("delete-button")
            .addEventListener("click", () => {
                return usersModule.deleteUser(uid);
            });

            // デフォルト表示
            return usersModule.setExistingValue(uid);
        default:
            break;
    }
})();

// original sourse
// document.getElementById("search-button").onclick = () => {
//     const searchValue = document.getElementById("search").value;
//     return searchModule.searchUsers(searchValue);
// }