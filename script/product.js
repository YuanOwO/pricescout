const query = (page = 1) => {
    let path = decodeURI(window.location.pathname).split("/");
    const category1 = path[1] || null,
        category2 = path[2] || null,
        category3 = path[3] || null,
        query = $("#search").val() || null;

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
            for (const product of data.products) {
                table.append(product_row(product, idx++));
                wall.append(product_card(product));
            }

            paginate("#pagination", data.page, Math.ceil(data.total_count / data.limit));
        },
        error: (error) => {
            console.log(error);
        },
    });
};

window.onload = () => {
    $.ajax({
        url: API_URL,
        type: "GET",
        error: (error) => {
            console.log(error);
            alert("後端 API 睡著了，請稍後再試。");
        },
    });
    navigate();
    query();
};
