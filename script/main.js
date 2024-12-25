const query = (id) => {
    // console.log(id);
    const category = id.split("-")[1];
    $.ajax({
        url: API_URL + "/products",
        type: "GET",
        data: {
            category1: category,
            limit: Math.floor($("#wall-生鮮").width() / (16 * 15)) + 3 || 10,
        },
        success: (data) => {
            // console.log(data);

            let wall = $("#" + id);
            wall.empty();
            for (const product of data.products) {
                wall.append(product_card(product));
            }

            // paginate("#pagination", data.page, Math.ceil(data.total_count / data.limit));
        },
        error: (error) => {
            console.log(error);
        },
    });
};

window.onload = () => {
    if (!Cookies.get("hello")) {
        // 第一次進入網站
        const modal = new bootstrap.Modal("#infoModal");
        modal.show();
        Cookies.set("hello", "world");
    }

    if (sessionStorage.getItem("query")) {
        // 刪除過去的搜尋條件
        sessionStorage.removeItem("query");
    }

    for (const wall of $(".products-wall")) {
        query(wall.id);
    }
};
