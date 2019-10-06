
(()=>{

    $(document).ready(() => {
        console.log('----- MANI LOADING -----')
        drawManager.init()
        treeManager.init()

        contextMenuController.wrapContextMenu(
            $('#graph'), 
            [{
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
            }]
        )

    })
})()
