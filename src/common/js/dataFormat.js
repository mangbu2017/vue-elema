export function formatDate(date, format) {
    let y = /(y+)/;
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };

    if (y.test(format)) {
        format = format.replace(y, function($, $1) {
            return (date.getFullYear() + '').substr(4 - $1.length);
        });
    }

    for (let k in o) {
        let t = new RegExp(`(${k})`);
        if (t.test(format)) {
            let str = o[k] + '';
            format = format.replace(t, function($, $1) {
                if ($1.length === 1) {
                    return str;
                }
                return addZero(str);
            });
        }
    }

    return format;
}

function addZero(str) {
    console.log('进入');
    return ('00' + str).substr(str.length);
}
