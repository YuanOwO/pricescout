const query = (page = 1) => {
    let path = decodeURI(window.location.pathname).split("/");
    let category1 = path[1] || undefined,
        category2 = path[2] || undefined,
        category3 = path[3] || undefined,
        query = $("#search").val() || "";

    // console.log(category1, category2, category3, query);

    if (category1 === "search") {
        category1 = undefined;
        category2 = undefined;
        category3 = undefined;
    }

    sessionStorage.setItem("query", query);

    $.ajax({
        url: API_URL + "/products",
        type: "GET",
        data: {
            category1: category1,
            category2: category2,
            category3: category3,
            query: query,
            page: page,
        },
        success: (data) => {
            // console.log(data);

            let table = $("#products-table tbody"),
                wall = $("#products-wall"),
                idx = (data.page - 1) * data.limit + 1;
            table.empty();
            wall.empty();

            $("#total-count").text(data.total_count);

            if (data.products.length === 0) {
                table.append(`
                    <tr>
                        <td colspan="7" class="">
                            <div class="alert alert-danger d-inline-block my-3" role="alert">
                                <div class="fs-2">喔不！<i class="bi bi-emoji-frown"></i></div>
                                這裡找不到你想要的商品！
                                <br>
                                你可以試試看調整搜尋範圍，或是回到<a href="/">首頁</a>看看其他商品！
                            </div>
                        </td>
                    </tr>
                `);
                wall.append(`
                    <div class="alert alert-danger my-5" role="alert">
                        <div class="fs-2">喔不！<i class="bi bi-emoji-frown"></i></div>
                        這裡找不到你想要的商品！
                        <br>
                        你可以試試看調整搜尋範圍，或是回到<a href="/">首頁</a>看看其他商品！
                    </div>
                `);
            }

            for (const product of data.products) {
                table.append(product_row(product, idx++));
                wall.append(product_card(product));
            }

            paginate("#pagination", data.page, Math.ceil(data.total_count / data.limit) || 1);
        },
        error: (error) => {
            console.log(error);
        },
    });
};

window.onload = () => {
    if (location.search) {
        const params = new URLSearchParams(location.search);
        if (params.has("query")) {
            let q = params.get("query");
            sessionStorage.setItem("query", q);
        }
    }

    if (Cookies.get("query")) {
        $("#search").val(sessionStorage.getItem("query"));
    }

    $("#search").keyup((e) => {
        if (e.key === "Enter") query();
    });

    navigate();
    query();
};
