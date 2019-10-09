
(()=>{

    $(document).ready(() => {
        console.log('----- MANI LOADING -----')

        window.isCtrlDown = false
        
        window.onkeydown = (e) => {
            if (e.keyCode == 17){
                window.isCtrlDown = true
            }
        }

        window.onkeyup = (e)=>{
            if (e.keyCode == 17){
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
                }
            ]
        )

    })
})()
