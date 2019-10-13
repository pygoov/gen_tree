
(() => {

    window.app = {
        isCtrlDown: false,
        init(){
            window.onkeydown = (e) => {
                if (e.keyCode == 17) {
                    this.isCtrlDown = true
                }
            }
            window.onkeyup = (e) => {
                if (e.keyCode == 17) {
                    this.isCtrlDown = false
                }
            }
        },
        request(url, data = {}, cb, failed_cb = null) {
            $.ajax({
                "url": url,
                "type": 'POST',
                "contentType": "application/json",
                "data": JSON.stringify(data),
                "success": (e) => {
                    cb(e)
                },
                "error": (e) => {
                    if ([403, 401].includes(e.status)) {
                        location.reload()
                    } else {
                        if (failed_cb == null) {
                            console.error(`Server response error[${e.status}]: "${e.responseText}"`)
                        } else {
                            failed_cb(e)
                        }
                    }
                }
            });
        },
        downloadFile(data, filename, type) {
            var file = new Blob([data], {
                type: type
            });

            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename);
            }
            else { // Others
                var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        makeRandomKey(length) {
            let result = '';
            let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;

            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
        }

    }

    $(document).ready(() => {
        console.log('----- MANI LOADING -----')
        
        app.init()
        fileManager.init()
        drawManager.init()
        treeManager.init()
    })
})()
