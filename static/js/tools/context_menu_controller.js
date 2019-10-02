(()=>{

    window.contextMenuController = {
        build_body(){
            return $('<div class="ui vertical menu ctx-menu hide">')
                .css('z-index','1000')
        },
        build_button(button, ctxMenu, e) {
            if(!button.is_show(e)) return null
            let item = $('<a class="item small">')
                .text(button.text)
                .append($(`<i class="icon ${button.icon_classes}">`))

            if(button.is_dropdown) {
                menu = $('<div class="menu">')
                for(let inner_button of button.dropdown_buttons) {
                    let ibi = this.build_button(inner_button, ctxMenu, e)
                    if(ibi != null){
                        menu.append(ibi)
                    }
                }
                item.append(menu)
            }
            else {
                item.click(() => {
                    button.click(e)
                    if(button.click_is_close) {
                        ctxMenu.remove()
                    }
                })
            }
            return item
        },
        wrapContextMenu(elem, buttons) {
            $(elem).contextmenu((e) => {
                e.preventDefault()
                e.returnValue = false;

                let ctxMenu = this.build_body()
                $('body').append(ctxMenu)

                let is_not_empty = false

                for(let button of buttons) {
                    let btn_item = this.build_button(button, ctxMenu, e)
                    if(btn_item != null){
                        ctxMenu.append(btn_item)
                        is_not_empty = true
                    }
                }

                if(is_not_empty){
                    ctxMenu
                        .removeClass('hide')
                        .css('left', e.clientX)
                        .css('top', e.clientY)
                }
                else {
                    ctxMenu.remove()
                }

            })
        },
        clearing(target){
            let ctxMenus = $('.ctx-menu')

            ctxMenus.each((i, item)=>{
                ctxMenu = $(item)

                if(ctxMenu.hasClass('hide')) {
                    return
                }

                if (!ctxMenu.is(target) && ctxMenu.has(target).length === 0)
                {
                    ctxMenu.remove()
                }
            })
        }
    }

    $(document).ready(() => {
        $(document).mousedown(function(e) {
            contextMenuController.clearing(e.target)
        })
        
    })

})()
