
(() => {

    $(document).ready(() => {
        console.log('----- MANI LOADING -----')

        window.isCtrlDown = false

        window.onkeydown = (e) => {
            if (e.keyCode == 17) {
                window.isCtrlDown = true
            }
        }
        window.onkeyup = (e) => {
            if (e.keyCode == 17) {
                window.isCtrlDown = false
            }
        }

        drawManager.init()
        treeManager.init()

        contextMenuController.wrapContextMenu(
            $('#graph'),
            [
                {
                    is_show: (e) => {
                        return true;
                    },
                    click: (e) => {
                        treeManager.addNewPeople(
                            drawManager.lastMousePos
                        )
                    },
                    click_is_close: true,
                    text: "Добавить человека",
                    icon_classes: "green add"
                },
                {
                    is_show: (e) => {
                        return treeManager.currentPeople != null;
                    },
                    click: (e) => {
                        treeManager.currentPeople.remove()
                        treeManager.selectPeople(null)
                    },
                    click_is_close: true,
                    text: "Удалить выбранного человека",
                    icon_classes: "red close"
                },
                {
                    is_show: (e) => {
                        return treeManager.currentLink != null;
                    },
                    click: (e) => {
                        treeManager.currentLink.remove()
                        treeManager.selectLink(null)
                    },
                    click_is_close: true,
                    text: "Удалить выбранную связь",
                    icon_classes: "red close"
                }
            ]
        )

        // let saveToFile = (text, fileName) => {
        //     let blob = new Blob([text], { type: 'text/plain' })
        //     let href = (window.webkitURL || window.URL).createObjectURL(blob)
        //     let x = $(`<a href="javascript:void(0);" onclick="document.execCommand('SaveAs',true,'file.html');">Save this page</a>`)
        //     $('[data-controll-id="mainMenu"]').append(
        //         $(`<a class="ui item" onclick="document.execCommand('SaveAs', true,'file.json');">Save this page</a>`)
        //             .attr('href', href)
        //     )


        //     // x.click()
        //     // let anchor = document.createElement('a');
        //     // anchor.download = fileName;
        //     // anchor.href = ;
        //     // anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        //     // anchor.click();
        // }

        $('[data-controll-id="fileOpen"]').click(() => {

        })

        $('[data-controll-id="fileSave"]').click(() => {
            // saveToFile(
            //     JSON.stringify(treeManager.getJson()),
            //     "save.json"
            // )
        })

    })
})()
