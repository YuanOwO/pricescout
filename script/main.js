const query = (id) => {
    // console.log(id);
    const category = id.split("-")[1];

    console.log("products query", {
        category1: category,
        limit: Math.floor($("#wall-生鮮").width() / (16 * 15)) + 3 || 10,
    });

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
    // 第一次進入網站
    if (!Cookies.get("hello")) {
        const modal = new bootstrap.Modal("#infoModal");
        modal.show();
        Cookies.set("hello", "world");
    }

    // 刪除過去的搜尋條件
    if (sessionStorage.getItem("query")) {
        sessionStorage.removeItem("query");
    }

    for (const wall of $(".products-wall")) {
        wall.innerHTML = `
            <div class="card flex-shrink-0 m-2">
                <div class="text-center">
                    <div class="spinner-border m-5" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-6"></span>
                        <span class="placeholder col-8"></span>
                    </p>
                    <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
                </div>
            </div>
        `.repeat(Math.floor(Math.random() * 5) + 1);
        query(wall.id);
    }
};
