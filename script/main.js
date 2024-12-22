const query = (id) => {
    console.log(id);
    const category = id.split("-")[1];
    $.ajax({
        url: API_URL + "/products",
        type: "GET",
        data: {
            category1: category,
            limit: Math.floor($("#wall-生鮮").width() / (16 * 15)) + 3 || 10,
        },
        success: (data) => {
            console.log(data);

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
    $.ajax({
        url: API_URL,
        type: "GET",
        error: (error) => {
            console.log(error);
            alert("後端 API 睡著了，請稍後再試。");
        },
    });
    for (const wall of $(".products-wall")) {
        query(wall.id);
    }
    // navigate();
    // query();
};
