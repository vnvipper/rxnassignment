(function ($, window, document, undefined) {

    var siteUri = 'http://localhost:63647/api/';

    var pluginHandler = {
        init: function () {
            $('#productNumber').select2({
                placeholder: "Select a Product Number",
                tags: true,
                tokenSeparators: [",", " "],
                allowClear: true
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

    var ajaxHandler = function(url, type, data, successCallback, failCallback){
        $.ajax({
            type: type,
            accepts: 'application/json',
            url: url,
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
        })
        .done(successCallback)
        .fail(function (jqXHR, textStatus, errorThrown) {
            if(jqXHR.status == 400) {
                var errors = jqXHR.responseJSON;
                var template = '<ul>';
                $.each(errors, function( property, data ) {
                    template += '<li>';
                    template += property + ': ' + data; 
                    template += '</li>';
                });
                template = template + '</ul>';
                toastr.error(template);
            }
            else
            {
                toastr.warning(errorThrown);
            }

            if(failCallback){
                failCallback();
            }
        });
    }

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
            self.onSaveClick();
            self.caculateCube();
        },
        loadProductNumber: function () {
            var dataUrl = siteUri + 'Master';
            ajaxHandler(dataUrl,'get', null, function (data) {
                $('#productNumber').val(null).trigger('change');
                $.each(data, function (key, value) {
                    var newOption = new Option(value, value, false, false);
                    $('#productNumber').append(newOption).trigger('change');
                });
            });
        },
        onSelectedProductNumber: function () {
            $('#productNumber').on('select2:select', function (e) {
                var dataUrl = siteUri + 'Master' + '/' + $(this).val();
                ajaxHandler(dataUrl, 'get', null, function (data) {
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
                }, function(){
                    $('#packSize').val(null);
                    $('#description').val(null);
                    $('#productImage').val(null);
                    var defaultImage = './img/placeholder.png';
                    $('#imagePreview').attr('src', defaultImage);
                    $("#detail-form").get(0).reset();
                    $('#isPrePack').trigger('change');
                    $('#prePack').trigger('change');
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
        },
        onSaveClick: function () {
            $('#btn-save').on('click', function () {

                var data = {
                    "productNumber": $('#productNumber').val(),
                    "packSize": $('#packSize').val(),
                    "description": $('#description').val(),
                    "productImage": $('#productImage').val(),
                    "isHazardousMaterial": $('#isHazardousMaterial').prop("checked"),
                    "costCenterCode": $('#costCenterCode').val(),
                    "expirationDate": $('#expirationDate').val(),
                    "unitPrice": $('#unitPrice').val(),
                    "width": $('#width').val(),
                    "length": $('#length').val(),
                    "height": $('#height').val(),
                    "isPrePack": $('#isPrePack').prop("checked"),
                    "prePack": $('#prePack').val(),
                };

                var isNewElement = $('#productNumber').find('[data-select2-tag="true"]');
                if (isNewElement.length) {
                    var dataUrl = siteUri + 'Master';                   
                    ajaxHandler(dataUrl, 'post', data, function (data) {
                        toastr.success("update success");
                        $('#productNumber').val(null).trigger('change');
                        var newOption = new Option(data.productNumber, data.productNumber, false, false);
                        $('#productNumber').append(newOption).trigger('change');                          
                        $('#packSize').val(null);
                        $('#description').val(null);
                        $('#productImage').val(null);
                        var defaultImage = './img/placeholder.png';
                        $('#imagePreview').attr('src', defaultImage);
                        $("#detail-form").get(0).reset();
                        $('#isPrePack').trigger('change');
                        $('#prePack').trigger('change');
                    });                   
                } else {
                    var dataUrl = siteUri + 'Master' + '/'+ $('#productNumber').val();
                    ajaxHandler(dataUrl, 'PUT', data, function (data) {
                        toastr.success("update success");
                    });                 
                }
            });

        },
        caculateCube: function(){
            $('#width, #length, #height').on('keyup', function(){
                var width = $('#width').val();
                var widthValue = width ? parseFloat(width).toFixed(3) : parseFloat(0).toFixed(3);
               
                var length = $('#length').val();
                var lengthValue = length ? parseFloat(length).toFixed(3) : parseFloat(0).toFixed(3);

                var height = $('#height').val();
                var heightValue = height ? parseFloat(height).toFixed(3) : parseFloat(0).toFixed(3);

                var cubeValue = widthValue * lengthValue * heightValue;

                $('#cube').val(parseFloat(cubeValue).toFixed(3));

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