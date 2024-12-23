# def search_items(item_list, query, exact_match=False):
#     """
#     搜尋商品名稱列表。

#     :param item_list: 商品名稱列表
#     :param query: 搜尋的關鍵字
#     :param exact_match: 是否啟用精確匹配
#     :return: 篩選後的商品名稱列表
#     """
#     if exact_match:
#         # 精確匹配：篩選出名稱中包含完整關鍵字的項目
#         return [item for item in item_list if query in item.split()]
#     else:
#         # 關鍵字搜尋：篩選出名稱中包含關鍵字的項目
#         return [item for item in item_list if query in item]


# # 測試資料
# item_list = ["筆記本電腦", "筆記型電腦", "筆和本子", "高性能筆記本", "本子"]

# # 測試範例
# query1 = "筆記本"

# print("關鍵字搜尋結果:", search_items(item_list, query1, exact_match=False))
# print("精確匹配結果:", search_items(item_list, query1, exact_match=True))


def search_items_partial(item_list, query):
    """
    部分匹配商品名稱列表。

    :param item_list: 商品名稱列表
    :param query: 搜尋的關鍵字
    :return: 篩選後的商品名稱列表
    """
    # 拆解搜尋詞為單個字，允許部分關鍵字匹配
    keywords = list(query)  # 將 "筆記本" 拆成 ["筆", "記", "本"]

    # 篩選：商品名稱中只要包含任何一個字元即可
    return [item for item in item_list if any(keyword in item for keyword in keywords)]


# 測試資料
item_list = ["筆記本電腦", "筆記型電腦", "筆和本子", "高性能筆記本", "本子"]

# 測試範例
query = "筆記本"

print("部分匹配結果:", search_items_partial(item_list, query))
