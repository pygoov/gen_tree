
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
                    console.log('xxx')
                },
                click_is_close: true,
                text: "Добавить дочерний концепт в конец",
                icon_classes: "green add"
            }]
        )

    })
})()
