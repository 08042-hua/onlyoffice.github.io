console.log("插件初始化开始");

// 初始化插件
window.Asc.plugin.init = function() {
    console.log("插件已初始化1");
};

// 上下文菜单显示事件
Asc.plugin.attachEvent("onContextMenuShow", (options) => {
    console.log("上下文菜单显示事件触发");

    const items = {
        guid: window.Asc.plugin.guid,
        items: [{
            id: "onClickItem1",
            text: { zh: "繁简转换器", en: "convert" },
            items: [{
                    id: "convertChineseToFan",
                    text: { zh: "简体字转繁体字", en: "Convert Select to Traditional" },
                },
                {
                    id: "convertFanToChinese",
                    text: { zh: "繁体字转简体字", en: "Convert Select to Simplified" },
                },
                {
                    id: "addPinyin",
                    text: { zh: "添加拼音", en: "Add pinyin" },
                },
                {
                    id: "removePinyin",
                    text: { zh: "去除拼音", en: "Remove pinyin" },
                },
            ],
        }]

    };
    window.Asc.plugin.executeMethod("UpdateContextMenuItem", [items]);


});


window.Asc.plugin.event_onContextMenuClick = (id) => {
    console.log(id)
    console.log(222)
        // 先获取当前选中的文本
    window.Asc.plugin.executeMethod("GetSelectedText", [], function(selectedText) {
        if (!selectedText || selectedText.trim() === "") {
            window.Asc.plugin.executeMethod("ShowMessage", ["请先选择一些文本"]);
            return;
        }

        console.log(selectedText)

        let result;
        if (id == "convertChineseToFan") {
            result = convertSimplifiedToTraditional(selectedText);
        } else if (id == "convertFanToChinese") {
            result = convertTraditionalToSimplified(selectedText);
        } else if (id == "addPinyin") {
            result = addPinyinAnnotations(selectedText);
        } else if (id == "removePinyin") {
            result = removePinyinAnnotations(selectedText);
        }
        // console.log(result)
        // 替换选中的文本
        // window.Asc.plugin.executeMethod("PasteHtml", [result]);
        window.Asc.plugin.executeMethod("PasteText", [result]);

    });
};

function action(id) {
    console.log(id)
    console.log(222)
        // 先获取当前选中的文本
    window.Asc.plugin.executeMethod("GetSelectedText", [], function(selectedText) {
        if (!selectedText || selectedText.trim() === "") {
            window.Asc.plugin.executeMethod("ShowMessage", ["请先选择一些文本"]);
            return;
        }

        console.log(selectedText)

        let result;
        if (id == "convertChineseToFan") {
            result = convertSimplifiedToTraditional(selectedText);
        } else if (id == "convertFanToChinese") {
            result = convertTraditionalToSimplified(selectedText);
        } else if (id == "addPinyin") {
            result = addPinyinAnnotations(selectedText);
        } else if (id == "removePinyin") {
            result = removePinyinAnnotations(selectedText);
        }
        // console.log(result)
        // 替换选中的文本
        // window.Asc.plugin.executeMethod("PasteHtml", [result]);
        window.Asc.plugin.executeMethod("PasteText", [result]);

    });
}
// 简体转繁体函数
function convertSimplifiedToTraditional(text) {
    console.log(111)
    const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
    return converter(text);
}

// 繁体转简体函数
function convertTraditionalToSimplified(text) {
    const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
    return converter(text);
}

function addPinyinAnnotations(text) {
    let result = '';
    for (const char of text) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
            const pinyin = pinyinPro.pinyin(char, { toneType: 'symbol', multiple: false });
            result += `<ruby>${char}<rt>${pinyin}</rt></ruby>`;
        } else {
            result += char;
        }
    }
    return result;
}
// function addPinyinAnnotations(text) {
//     let result = '';
//     for (const char of text) {
//         if (/[\u4e00-\u9fa5]/.test(char)) {
//             const pinyin = pinyinPro.pinyin(char, { toneType: 'symbol', multiple: false });
//             result += `<span style="display:table; text-align:center; line-height:1;">
//                         <span style="display:table-row; font-size:0.6em;">${pinyin}</span>
//                         <span style="display:table-row;">${char}</span>
//                        </span>`;
//         } else {
//             result += char;
//         }
//     }
//     return result;
// }

function addPinyinAnnotations(text) {
    let result = '';
    for (const char of text) {
        // 如果是汉字则添加拼音注解
        if (/[\u4e00-\u9fa5]/.test(char)) {
            const pinyin = pinyinPro.pinyin(char, {
                toneType: 'symbol',
                multiple: false // 只取第一个读音
            });
            result += `${char}(${pinyin})`;
        } else {
            result += char; // 非汉字直接保留
        }
    }
    return result;
}


function removePinyinAnnotations(text) {
    return text.replace(/([\u4e00-\u9fa5])\([^)]*\)/g, '$1');
}