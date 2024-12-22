const API_URL = "https://api.pricescout.yuanowo.xyz/api/v1";

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
                console.log(data);
                let table = $("#products-table"),
                    pagination = $("#pagination"),
                    idx = (data.page - 1) * data.limit + 1;

                table.empty();
                for (const product of data.products) {
                    let unit_price;
                    if (product.unit === "入") unit_price = `$${product.price_unit} / ${product.unit}`;
                    else unit_price = `$${Math.round(product.price_unit * 10000) / 100} / 100${product.unit}`;

                    table.append(`
                        <tr>
                            <th scope="row">${idx++}</th>
                            <td>
                                <img
                                    src="${product.pic_url}"
                                    alt=""
                                    height="100"
                                />
                            </td>
                            <td>
                                <a
                                    href="${product.url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >${product.name}</a
                                >
                            </td>
                            <td>$${product.price}</td>
                            <td>${product.spec}${product.unit}</td>
                            <td>${unit_price}</td>
                            <td>${product.channel}</td>
                        </tr>
                    `);
                }
                ////////////////////////////////////////////////////////////////////////////////////////////////////////

                // 產生頁碼

                let page = data.page,
                    total = Math.ceil(data.total_count / data.limit),
                    start = Math.max(1, page - 5),
                    end = Math.min(total, start + 10);

                if (end - start < 10) start = Math.max(1, end - 10);

                console.log(page, total);
                pagination.empty();

                pagination.append(`
                <li class="page-item">
                    <a
                        class="page-link ${page === 1 && "disabled"}"
                        onclick="query(${page - 1});"
                        aria-label="Previous"
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            `);

                if (start > 1)
                    pagination.append(`
                    <li class="page-item">
                        <a class="page-link" onclick="query(1);">1</a>
                    </li>
                `);
                if (start > 2)
                    pagination.append(`
                    <li class="page-item disabled">
                        <a class="page-link">...</a>
                    </li>
                `);

                for (let i = start; i <= end; i++)
                    pagination.append(`
                    <li class="page-item ${page === i && "active"}">
                        <a class="page-link" onclick="query(${i});">${i}</a>
                    </li>
                `);

                if (end < total - 1)
                    pagination.append(`
                    <li class="page-item disabled">
                        <a class="page-link">...</a>
                    </li>
                `);
                if (end < total)
                    pagination.append(`
                    <li class="page-item">
                        <a class="page-link" onclick="query(${total});">${total}</a>
                    </li>
                `);

                pagination.append(`
                <li class="page-item">
                    <a
                        class="page-link ${page === total && "disabled"}"
                        onclick="query(${page + 1});"
                        aria-label="Next"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            `);
            },
            error: (error) => {
                console.log(error);
            },
        });
    },
    navigate = () => {
        let path = decodeURI(window.location.pathname).split("/");
        const category1 = path[1] || null,
            category2 = path[2] || null,
            category3 = path[3] || null;

        $.ajax({
            url: API_URL + "/subcategory",
            type: "GET",
            data: {
                category1: category1,
                category2: category2,
                category3: category3,
            },
            success: (data) => {
                console.log(data);
                let breadcrumbs = $('<ol class="breadcrumb" style="margin-bottom: 0;"></ol>'),
                    subcat = $('<ol class="breadcrumb"></ol>');

                breadcrumbs.append(
                    '<li class="breadcrumb-item"><a href="/"><span class="material-symbols-outlined">home</span></a></li>'
                );
                console.log(path);

                for (let i = 1; i < path.length - 1; i++)
                    if (i === path.length - 2) breadcrumbs.append(`<li class="breadcrumb-item active">${path[i]}</li>`);
                    else
                        breadcrumbs.append(`
                            <li class="breadcrumb-item">
                                <a href="/${path.slice(1, i + 1).join("/")}">${path[i]}</a>
                            </li>
                        `);

                // if (category1)
                //     breadcrumbs.append(`<li class="breadcrumb-item"><a href="/${category1}">${category1}</a></li>`);
                // if (category2) {
                //     if (category3)
                //         breadcrumbs.append(
                //             `<li class="breadcrumb-item"><a href="/${category1}/${category2}">${category2}</a></li>`
                //         );
                //     else breadcrumbs.append(`<li class="breadcrumb-item active">${category2}</li>`);
                // }
                // if (category3) breadcrumbs.append(`<li class="breadcrumb-item active">${category3}</li>`);

                for (const item of data) {
                    let path = window.location.pathname;
                    if (!path.endsWith("/")) path += "/";
                    subcat.append(`<li class="breadcrumb-item"><a href="${path}${item}">${item}</a></li>`);
                }
                let navigator = $("#navigator");
                navigator
                    .addClass("my-3")
                    .empty()
                    .append(
                        $('<nav style="--bs-breadcrumb-divider: \'>\';" aria-label="breadcrumb"></nav>').append(
                            breadcrumbs
                        )
                    );
                if (data.length)
                    navigator
                        .append("<div>可以再更深入一點：</div>")
                        .append($('<nav aria-label="breadcrumb"></nav>').append(subcat));

                navigator.append("<hr />");
            },
            error: (error) => {
                console.log(error);
            },
        });
    };

window.onload = function () {
    $.ajax({
        url: API_URL,
        type: "GET",
        success: (data) => {
            if (data.message !== "Hello World") {
                alert("後端 API 發生錯誤，請稍後再試。");
                return;
            }
            navigate();
            query();
        },
        error: (error) => {
            console.log(error);
            alert("後端 API 睡著了，請稍後再試。");
        },
    });
};
