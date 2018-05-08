(function ($, window, document, undefined) {

    var siteUri = 'http://localhost:63647/api/';

    var pluginHandler = {
        init: function () {
            $('#productNumber').select2({
                placeholder: "Select a Product Number",
                tags: true,
                tokenSeparators: [",", " "]
            }).on("change", function (e) {
                var isNew = $(this).find('[data-select2-tag="true"]');
                if (isNew.length) {
                    var r = confirm("do you want to create a tag?");
                    if (r == true) {
                        isNew.replaceWith('<option selected value="' + isNew.val() + '">' + isNew.val() + '</option>');
                    } else {
                        $('.select2-selection__choice:last').remove();
                        $('.select2-search__field').val(isNew.val()).focus()
                    }
                }
            });

            $('#prePack').select2({
                placeholder: "Select a prepack",
                allowClear: true
            });

            $('#expirationDate').datepicker({
                format: "mm/dd/yyyy",
                autoclose: true
            });

            jqueryGridHandler.load();
        }
    }

    // var masterItem = {};

    // var masterItemController = {
    //     url: apiUrl + 'Master',
    //     getAll: function (productNumber) {
    //         var masterUri = this.url;
    //         $.ajax({
    //             type: 'get',
    //             url: masterUri,
    //             dataType: 'json',
    //             contentType: 'application/json',
    //         })
    //         .done(function (data) {
    //             // console.log(data);
    //             // masterItem = data;
    //             return masterItem;
    //         })
    //         .fail(function (jqXHR, textStatus, errorThrown) {
    //             alert(errorThrown);
    //         });        
    //     },
    //     get: function (productNumber) {
    //         var masterUri = this.url + '/' + productNumber;
    //         $.ajax({
    //             type: 'get',
    //             url: masterUri,
    //             dataType: 'json',
    //             contentType: 'application/json',
    //         })
    //         .done(function (data) {
    //             console.log(data);
    //             masterItem = data;
    //             // return masterItem;
    //         })
    //         .fail(function (jqXHR, textStatus, errorThrown) {
    //             alert(errorThrown);
    //         });        
    //     },
    //     add: function(item){
    //         var masterUri = url;
    //         $.ajax({
    //             type: 'post',
    //             url: masterUri,
    //             dataType: 'json',
    //             contentType: 'application/json',
    //             data: item ? JSON.stringify(item) : null
    //         })
    //         .done(function (data) {
    //             console.log(data);
    //         })
    //         .fail(function (jqXHR, textStatus, errorThrown) {
    //             alert(errorThrown);
    //         });
    //     },
    //     edit: function(item){
    //         var masterUri = url;
    //         $.ajax({
    //             type: 'push',
    //             url: masterUri,
    //             dataType: 'json',
    //             contentType: 'application/json',
    //             data: item ? JSON.stringify(item) : null
    //         })
    //         .done(function (data) {
    //             console.log(data);
    //         })
    //         .fail(function (jqXHR, textStatus, errorThrown) {
    //             alert(errorThrown);
    //         });
    //     },
    // };

    var imageHandler = {
        init: function () {
            function readURL(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $('#imagePreview').attr('src', e.target.result);
                        var base64result = e.target.result.split(',')[1];
                        $('#productImage').val(base64result);
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            }

            $('#btn-browser').on('click', function () {
                $("#inputfile").trigger("click");
            });

            $("#inputfile").change(function () {
                readURL(this);
            });

            $('#btn-clear').on('click', function () {
                var defaultImage = './img/placeholder.png';
                $('#imagePreview').attr('src', defaultImage);
                $('#productImage').val(null);
            });
        }
    }

    var jqueryGridHandler = {
        load: function () {
            var dataUrl = siteUri + 'Inventory' + '/Mockdata';
            $("#jqGrid").jqGrid({
                url: dataUrl,
                datatype: 'json',
                mtype: 'get',
                styleUI: 'Bootstrap',
                emptyrecords: 'No records',
                colNames: ['Location', 'On-Hand', 'On-Hand Pcs', 'Allocated', 'Allocated Pcs', 'Available', 'Available Pcs'],
                colModel: [{
                        name: "location"
                    },
                    {
                        name: "onHand"
                    },
                    {
                        name: "onHandPcs"
                    },
                    {
                        name: "allocated"
                    },
                    {
                        name: "allocatedPcs"
                    },
                    {
                        name: "available"
                    },
                    {
                        name: "availablePcs"
                    }
                ],
                viewrecords: true,
                rowNum: 20,
                pager: "#jqGridPager",
                rowNum: 10,
                rowList: [10, 20, 30, 40],
                footerrow: true,
                userDataOnFooter: true,
                loadComplete: function () {
                    // footer data
                    $(this).jqGrid("footerData", "set", {
                        location: "ALL SITE:",
                        onHand: $(this).jqGrid('getCol', 'onHand', false, 'sum'),
                        onHandPcs: $(this).jqGrid('getCol', 'onHandPcs', false, 'sum'),
                        allocated: $(this).jqGrid('getCol', 'allocated', false, 'sum'),
                        allocatedPcs: $(this).jqGrid('getCol', 'allocatedPcs', false, 'sum'),
                        available: $(this).jqGrid('getCol', 'available', false, 'sum'),
                        availablePcs: $(this).jqGrid('getCol', 'availablePcs', false, 'sum')
                    });
                },
            });
        },
        reload: function () {
            var itemMasterId = $('#grid-link').attr('data-master-id');
            if (itemMasterId.length) {
                var dataUrl = siteUri + 'Inventory' + '?masterId=' + itemMasterId;
                $("#jqGrid").jqGrid().setGridParam({
                    url: dataUrl
                }).trigger("reloadGrid");
            } else {
                var dataUrl = siteUri + 'Inventory' + '/Mockdata';
                $("#jqGrid").jqGrid().setGridParam({
                    url: dataUrl
                }).trigger("reloadGrid");
            }
        }
    }

    var siteHandler = {
        init: function () {

            $('#isPrePack').on('change', function () {
                var isCheck = $(this).prop("checked");
                $('#prePack').prop("disabled", !isCheck);
            });

            $('#isPrePack').trigger('change');

            var self = this;
            self.loadProductNumber();
            self.onSelectedProductNumber();
            self.onClickInventoryTab();
        },
        loadProductNumber: function () {
            var masterItemUri = siteUri + 'Master';
            $.ajax({
                    type: 'get',
                    url: masterItemUri,
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .done(function (data) {
                    $('#productNumber').val(null).trigger('change');
                    $.each(data, function (key, value) {
                        var newOption = new Option(value.productNumber, value.productNumber, false, false);
                        $('#productNumber').append(newOption).trigger('change');
                    });
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                });
        },
        onSelectedProductNumber: function () {
            $('#productNumber').on('select2:select', function (e) {
                var masterItemUri = siteUri + 'Master' + '/' + $(this).val();
                $.ajax({
                        type: 'get',
                        url: masterItemUri,
                        dataType: 'json',
                        contentType: 'application/json',
                    })
                    .done(function (data) {
                        // Select tab by name
                        $('.nav-tabs a[href="#basic-info"]').tab('show')
                        $('#grid-link').attr('data-master-id', data.productNumber);
                        $('#packSize').val(data.packSize);
                        $('#description').val(data.description);

                        if (data.productImage) {
                            $('#productImage').val(data.productImage);
                            $('#imagePreview').attr('src', data.imagePreview);
                        } else {
                            var defaultImage = './img/placeholder.png';
                            $('#imagePreview').attr('src', defaultImage);
                        }

                        $('#isHazardousMaterial').prop("checked", data.isHazardousMaterial);

                        $('#costCenterCode').val(data.costCenterCode);
                        $('#expirationDate').val(data.expirationDate);
                        $('#unitPrice').val(data.unitPrice);
                        $('#width').val(data.width);
                        $('#length').val(data.length);
                        $('#height').val(data.height);
                        $('#cube').val(data.cube);
                        $('#isPrePack').prop("checked", data.isPrePack);
                        $('#isPrePack').trigger('change');
                        $('#prePack').val(data.prePack);
                        $('#prePack').trigger('change');

                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        alert(errorThrown);
                    });
            });
        },
        onClickInventoryTab: function () {
            $('#grid-link').on('click', function () {
                var li = $(this).closest('li');
                console.log(li);
                if (!li.hasClass('active')) {
                    jqueryGridHandler.reload();
                }
            });
        }
    }



    // please modulize your functions so we can reuse/turn on & off easily
    $(document).ready(function () {
        pluginHandler.init();
        imageHandler.init();
        siteHandler.init();
    });

})(jQuery, window, document);