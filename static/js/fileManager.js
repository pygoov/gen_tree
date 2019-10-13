(() => {

    window.fileManager = {
        currentFileName: null,
        formSaveAs: null,
        inputFileNamne: null,
        listFileOpen: null,
        init() {
            this.inputFileNamne = $('[data-control-id=pFileName]')
            this.listFileOpen = $('[data-control-id=listFileOpen]')
            this.formSaveAs = $('[data-control-id=formSaveAs]')
                .form({
                    submit: function (e) {
                        return false
                    },
                    fields: {
                        password: {
                            identifier: 'fileName',
                            rules: [{
                                type: 'empty',
                                prompt: 'Пожалуйста, введите имя сохроняемого файла'
                            }]
                        }
                    }
                })

            $('[data-control-id="fileOpen"]').click(() => {
                this.openMdOpenFile()
            })

            $('[data-control-id="fileSaveAs"]').click(() => {
                if (this.currentFileName != null) {
                    this.inputFileNamne.val(this.currentFileName)
                }
                else {
                    this.inputFileNamne.val('')
                }

                this.openMdSaveAs()
            })

            $('[data-control-id="fileDownload"]').click(() => {

            })
        },
        buildFileItem(fileName) {
            let item = $('<div class="item">')
                .attr('data-file-name', fileName)
                .append($('<i class="ui green icon file"></i>'))
                .append(
                    $('<div class="content">')
                        .append($('<div class="header">').text(fileName))
                )
                .click(() => {
                    this.listFileOpen.children().removeClass('active')
                    item.addClass('active')
                })

            return item
        },
        buildListOpenFile(cb) {
            this.listFileOpen.empty()
            fileManager.getListFiles((data) => {
                for (let fileName of data) {
                    let item = this.buildFileItem(fileName)
                    this.listFileOpen.append(item)
                }
                cb()
            })
        },
        openMdOpenFile() {
            this.buildListOpenFile(() => {
                $('[data-control-id=mdFileOpen]')
                    .modal({
                        blurring: true,
                        onApprove: () => {
                            let x = this.listFileOpen.children('.active')
                            if (x.length == 0) {
                                alert("Выберите пожалуйста файл для открытия!")
                                return false
                            }
                            this.openFile(x.attr('data-file-name'))
                        }
                    })
                    .modal('show')
            })
        },
        openMdSaveAs() {
            $('[data-control-id=mdFileSaveAs]')
                .modal({
                    blurring: true,
                    onApprove: () => {
                        this.formSaveAs.submit()
                        if (!this.formSaveAs.form('is valid')) {
                            return false
                        }

                        this.saveFile(
                            this.inputFileNamne.val(),
                            treeManager.getJson()
                        )
                    }
                })
                .modal('show')
        },
        getListFiles(cb) {
            app.request(
                "get_list_files",
                null,
                (data) => {
                    cb(data)
                }
            )
        },
        openFile(fileName) {
            app.request(
                "open_file",
                {
                    "file_name": fileName
                },
                (data) => {
                    this.currentFileName = fileName
                    treeManager.loadJson(data)
                }
            )
        },
        saveFile(fileName, data) {
            app.request(
                "save_file",
                {
                    "file_name": fileName,
                    "data": data
                },
                () => {
                    this.currentFileName = fileName
                    alert("Сохранение прошло успешно")
                },
                (err) => {
                    alert("При сохранении произошла ошибка:\n" + err.responseText)
                    console.log(err)
                    this.openMdSaveAs()
                }
            )
        }
    }

})()