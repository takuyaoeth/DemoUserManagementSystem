const searchModule = (() => {
    const BASE_URL = `http://localhost:${port}/api/v1/search?q=`;
    return {
        searchUsers: async (searchValue) => {
            document.getElementById("users-table").innerHTML="";

            const res = await fetch(BASE_URL + searchValue);
            const users = await res.json();
            for(const key in users) {
                const user = users[key];
                const body = `<tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.profile}</td>
                                <td>${user.date_of_birth}</td>
                                <td>${user.created_at}</td>
                                <td>${user.updated_at}</td>
                                </tr>`;
                document.getElementById("users-table").insertAdjacentHTML("beforeend", body);
            } 
        }
    }
})();