const API_URL = "https://api.pricescout.yuanowo.xyz/api/v1";
// const API_URL = "http://localhost:5000/api/v1";

const product_row = (product, idx) => {
        let unit_price;
        if (product.unit === "入") unit_price = `$${product.price_unit} / ${product.unit}`;
        else unit_price = `$${Math.round(product.price_unit * 10000) / 100} / 100${product.unit}`;
        let row = $(`
            <tr>
                <th scope="row">${idx}</th>
                <td>
                    <img
                        src="${product.pic_url}"
                        alt="${product.name}"
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
        return row;
    },
    product_card = (product) => {
        let unit_price;
        if (product.unit === "入") unit_price = `$${product.price_unit} / ${product.unit}`;
        else unit_price = `$${Math.round(product.price_unit * 10000) / 100} / 100${product.unit}`;
        let card = $(`
            <div class="card m-2 flex-shrink-0">
                <img
                    class="card-img-top"
                    src="${product.pic_url}"
                    alt="${product.name}"
                />
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">價格: $${product.price}</li>
                    <li class="list-group-item">規格: ${product.spec}${product.unit}</li>
                    <li class="list-group-item">單位價格: ${unit_price}</li>
                    <li class="list-group-item">販售通路: ${product.channel}</li>
                </ul>
                <div class="card-footer">
                    <a
                        class="btn btn-primary"
                        href="${product.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        前往賣場<i class="bi bi-box-arrow-up-right ms-2"></i>
                    </a>
                </div>
            </div>
        `);
        return card;
    },
    paginate = (selector, page, total) => {
        const page_item = (page, label = undefined, active = undefined, disabled = undefined) => {
            return $(`
                <li class="page-item ${active && "active"} ${disabled && "disabled"}">
                    <a class="page-link" onclick="query(${page});">${label || page}</a>
                </li>
            `);
        };

        let pagination = $(selector),
            start = Math.max(1, page - 2),
            end = Math.min(total, start + 4);

        if (end <= 7) {
            start = 1;
            end = Math.min(total, 7);
        }
        if (start >= total - 6) {
            start = Math.max(1, total - 6);
            end = total;
        }

        pagination.empty();

        pagination.append(page_item(page - 1, "&laquo;", undefined, page === 1));

        if (start > 1) {
            pagination.append(page_item(1));
            pagination.append(page_item(0, "...", undefined, true));
        }

        for (let i = start; i <= end; i++) {
            pagination.append(page_item(i, undefined, i === page));
        }

        if (end < total) {
            pagination.append(page_item(0, "...", undefined, true));
            pagination.append(page_item(total));
        }

        pagination.append(page_item(page + 1, "&raquo;", undefined, page === total));
    },
    toggleView = (view) => {
        let table = $("#products-table"),
            wall = $("#products-wall");

        Cookies.set("view", view);

        if (view === "table") {
            table.removeClass("d-none");
            wall.addClass("d-none");
        } else {
            table.addClass("d-none");
            wall.removeClass("d-none");
        }
    },
    navigate = () => {
        let path = decodeURI(window.location.pathname).split("/"),
            category1 = path[1] || null,
            category2 = path[2] || null,
            category3 = path[3] || null;

        if (category1 === "search") {
            category1 = null;
            category2 = null;
            category3 = null;
        }

        let breadcrumbs = $('<ol class="breadcrumb"></ol>');

        breadcrumbs.append('<li class="breadcrumb-item"><a href="/"><i class="bi bi-house-door"></i></a></li>');

        let navigator = $("#navigator");
        navigator
            .addClass("my-3")
            .empty()
            .append($('<nav id="breadcrumb" aria-label="breadcrumb"></nav>').append(breadcrumbs));

        for (let i = 1; i < path.length - 1; i++) {
            if (path[i] === "search") {
                path[i] = "搜尋";
            }
            if (i === path.length - 2) {
                breadcrumbs.append(`<li class="breadcrumb-item active">${path[i]}</li>`);
            } else {
                breadcrumbs.append(`
                    <li class="breadcrumb-item">
                        <a href="/${path.slice(1, i + 1).join("/")}">${path[i]}</a>
                    </li>
                `);
            }
        }

        $.ajax({
            url: API_URL + "/subcategory",
            type: "GET",
            data: {
                category1: category1,
                category2: category2,
                category3: category3,
            },
            success: (data) => {
                // console.log(data);

                let subcat = $('<ol class="breadcrumb"></ol>');

                for (const item of data) {
                    let path = window.location.pathname;
                    if (!path.endsWith("/")) path += "/";
                    if (path === "/search/") path = "/";
                    subcat.append(`<li class="breadcrumb-item"><a href="${path}${item}">${item}</a></li>`);
                }

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

window.addEventListener("load", () => {
    // 變更網頁標題
    let path = decodeURI(window.location.pathname).split("/"),
        title = path.slice(1, -1).join("．");
    if (title === "about") title = "關於";
    if (title === "search") title = "搜尋";
    if (title !== "") document.title = "超市商品比價網 | " + title;

    // 設定導覽列
    if (path[1] !== "search") {
        $("#nav-" + path[1]).addClass("active");
        // location = location.href.split("?")[0];
    }

    // 設定檢視模式
    toggleView(Cookies.get("view") || "table");

    // 檢查 API 連線
    if (!Cookies.get("api_health")) {
        $.ajax({
            url: API_URL + "/healthz",
            type: "GET",
            success: (data) => {
                // console.log(data);
                console.log("API 連線成功！");
                Cookies.set("api_health", "ok", { expires: 10 / 60 / 24 });
            },
            error: (error, textStatus, errorThrown) => {
                console.log(error);
                console.log(textStatus);
                console.log(errorThrown);
                if (textStatus === "timeout") {
                    alert("後端 API 睡著了，請稍後再試。");
                } else {
                    alert("後端 API 錯誤，請聯繫網站管理員。");
                }
            },
            timeout: 5000,
        });
    }
});
