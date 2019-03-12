/* Plugin Name : Custome Data Table, 
 * Developed By : Prasanna Kumar
 * Date : 18/02/2019
 * Features : Table prepare with pagination from server side and local, search, show per page, search 
 */


(function ($) {
    var tableIndex = [];
    var tableSettings = [];
    var $this = '';
    var tIndex = 1;
    var tBody = {table: "", totalcount: 0};
    var jsonParse = '';
    var __ajaxCall = [];
    var loadtableIndex = [];

    $.fn.customeDataTable = function (options) {
        var settings = $.extend({
            tableIndex: 1,
            data: {},
            searchcolumns: [], // Sno - local - true, server - false 
            headers: [], // Sno - If want Sno - true otherwise Sno : false,
            structure: "json", // json, table, local 
            orderby: 0, // 0 - ascending, 1 - decending
            perpage: 10,
            actionurl: '',
            actiontype: 'get', // get, post,
            search: true, // true or false,
            localpagination: true, // true or false it will use in full data get from server at on time.
            serverpagination: true, // true or false
            newcall: false,
            tableprepare: '',
            skip: 1
        }, options);

        tIndex = settings.tableIndex;
        this.each(function () {
            if ((typeof loadtableIndex[tIndex] === 'undefined') || (loadtableIndex[tIndex] === true)) {
                __ajaxCall[tIndex] = true;
                loadtableIndex[tIndex] = true;
                tableIndex[tIndex] = $(this);
                tableSettings[tIndex] = settings;
                $this = $(this);
            } else {
                $this = tableIndex[tIndex];
                settings = tableSettings[tIndex];
            }
            var dataTable = '';
            var structure = settings.structure;
            if (structure === 'local') {
                __ajaxCall[tIndex] = false;
                settings.serverpagination = false;
                dataTable = tableFullDataStructure();
            } else if (structure === 'json') {
                dataTable = jsonStructure();
            } else {
                dataTable = tableStructure();
            }
            if (dataTable) {
                $this.html(dataTable);
            }
        });

        function ajaxCall() {
            var params = settings.data;
            params.orderby = settings.orderby;
            params.limit = settings.perpage;
            params.skip = settings.skip;
            params.pagination = settings.serverpagination;
            var result = '';
            $.ajax({
                url: settings.actionurl,
                type: settings.actiontype,
                data: JSON.stringify(params),
                async: false,
                success: function (response) {
                    if (typeof response === 'string') {
                        jsonParse = JSON.parse(response);
                    } else {
                        jsonParse = response;
                    }
                    var records = jsonParse['data'];
                    if (settings.structure === 'json') {
                        records = JSON.stringify(jsonParse);
                        result = window[settings.tableprepare](records);
                    } else {
                        result = records;
                        var perPage = settings.perpage;
                        var totalCount = jsonParse.totalcount;
                        var paginationBody = pagination(totalCount, perPage, settings.skip);
                        var table = '<div>' + prepareSearch() + result + paginationBody + '</div>';
                        $this.html(table);
                    }
                    searchValue = '';
                },
                error: function () {

                }
            });
            result = {
                table: result,
                totalcount: jsonParse['totalcount']
            };
            return result;
        }

        function prepareThead() {
            var headers = settings.headers;
            if (headers.length > 0) {
                var thead = '<thead>';
                if (settings.structure === 'local') {
                    thead += $this.find('table thead').html();
                } else {
                    thead += '<tr>';
                    if (headers.length > 0) {
                        for (var headerkey in headers) {
                            thead += '<th>' + headers[headerkey] + '</th>';
                        }
                    }
                    thead += '</tr>';
                }
                thead += '</thead>';
                return thead;
            }
            return '';
        }

        function jsonStructure() {
            var jsonStructure = '';
            if (settings.serverpagination === true) {
                jsonStructure = jsonPerPageStructure();
            } else {
                settings.serverpagination = false;
                jsonStructure = jsonFullDataStructure();
            }
            return jsonStructure;
        }

        function jsonPerPageStructure() {
            tBody = ajaxCall();
            var table = '<div>';
            table += prepareSearch();
            var perPage = settings.perpage;
            var totalCount = tBody.totalcount;
            var paginationBody = pagination(totalCount, perPage, settings.skip);
            var tHead = prepareThead();
            if (tHead !== '') {
                table += '<div><table class="table table-bordered">' + tHead + tBody.table + '</table></div>' + paginationBody + '</div>';
            } else {
                table += '<div>' + tBody.table + '</div>' + paginationBody + '</div>';
            }
            return table;
        }

        function jsonFullDataStructure() {
            if (__ajaxCall[tIndex] === true || settings.newcall === true) {
                settings.skip = 1;
                tBody = ajaxCall();
                __ajaxCall[tIndex] = false;
                var paginationBody = '';
                if (settings.localpagination === true) {
                    var perPage = settings.perpage;
                    var totalCount = '';
                    totalCount = tBody.totalcount;
                    paginationBody = pagination(totalCount, perPage, settings.skip);
                }
                var table = '<div>';
                var tHead = prepareThead();
                table += prepareSearch();
                if (tHead !== '') {
                    table += '<div><table class="table table-bordered">' + tHead + tBody.table + '</table></div>' + paginationBody + '</div>';
                } else {
                    table += '<div>' + tBody.table + '</div>' + paginationBody + '</div>';
                }
                $this.html(table);
            }

            prepareFinalTable();

        }

        function tableStructure() {
            var tableStructure = '';
            if (settings.serverpagination === true) {
                tableStructure = tablePerPageStructure();
            } else {
                settings.serverpagination = false;
                tableStructure = tableFullDataStructure();
            }
            return tableStructure;
        }

        function tablePerPageStructure() {
            return jsonPerPageStructure();
        }

        function tableFullDataStructure() {
            if (__ajaxCall[tIndex] === true || settings.newcall === true) {
                __ajaxCall[tIndex] = false;
                tBody = ajaxCall();
                settings.skip = 1;
            }
            return prepareFinalTable();
        }

        function prepareFinalTable() {
            var perPage = settings.perpage;
            var records = prepareSearchData();
            records = JSON.parse(records);
            var offset = (settings.skip - 1) * perPage;
            var limit = offset + perPage;
            var totalCount = records.totalCount;
            var paginationBody = '';
            if (settings.localpagination === true) {
                paginationBody = pagination(totalCount, perPage, settings.skip);
                records.tableIndex = records.tableIndex.slice(offset, limit);
            }
            localTablePrepare(records.tableIndex);

            var search = prepareSearch();
            if ($this.find('#searchHtml').length > 0) {
                $this.find('#searchHtml').replaceWith(search);
            } else {
                $this.prepend(search);
            }
            if ($this.find('#paginationHtml').length > 0) {
                $this.find('#paginationHtml').replaceWith(paginationBody);
            } else {
                $this.append(paginationBody);
            }
            return '';
        }

        function localTablePrepare(tableIndex) {
            var table = $this.find('tbody tr');
            $.each(table, function (key, value) {
                if ($.inArray(key, tableIndex) == -1) {
                    $this.find('tbody tr').eq(key).hide();
                } else {
                    $this.find('tbody tr').eq(key).show();
                }
            });
        }

        function prepareSearchData() {
            $totalCount = 0;
            $columns = [];
            $tableIndex = [];
            $i = 0;
            $searchValue = $('.datatable-search-input-' + settings.tableIndex).val();
            if (typeof $searchValue === 'undefined') {
                $searchValue = '';
            }
            $searchcolumns = settings.searchcolumns;
            if ($searchcolumns.length <= 0) {
                $this.find('th').each(function () {
                    $columnName = $(this).text();
                    $columns[$i] = $columnName;
                    $i++;
                });
            } else {
                $this.find('th').each(function () {
                    $columnName = $(this).text();
                    if ($.inArray($columnName, $searchcolumns) > -1) {
                        $columns[$i] = $columnName;
                    }
                    $i++;
                });
            }
            $.each($this.find('table tbody tr'), function () {
                $jsonrow = {};
                $match = false;
                $.each($(this).find('td'), function () {
                    $tdIndex = $(this).index();
                    $key = $columns[$tdIndex];
                    if (typeof $key !== 'undefined') {
                        $jsonrow[$key] = $(this).text();
                    }
                });
                $index = $(this).index();
                if ($searchValue === '') {
                    $totalCount++;
                    $tableIndex.push($index);
                } else {
                    $searchValue = $searchValue.toLowerCase();
                    $jsonrowCheck = false;
                    for (var key in $jsonrow) {
                        if ($jsonrow[key].toLowerCase().indexOf($searchValue) !== -1) {
                            $jsonrowCheck = true;
                            break;
                        }
                    }
                    if ($jsonrowCheck === true) {
                        $totalCount++;
                        $tableIndex.push($index);
                    }
                }
            });
            $json = {totalCount: $totalCount, tableIndex: $tableIndex};
            return JSON.stringify($json);
        }

        function pagination(totalCount, perpage, pageNo) {
            settings.skip = parseInt(pageNo);
            $pagination = Math.ceil(totalCount / perpage);
            var htmlBanner = '';
            if ($pagination > 1) {
                $paginationLength = 5;
                $p = 1;
                htmlBanner += '<div id="paginationHtml" class="text-center" ><ul id="pagination" class="pagination">';

                if ($pagination > 5) {
                    if ($pagination > settings.skip) {
                        if (settings.skip >= 5) {
                            htmlBanner += '<li class="" style="cursor: pointer;"   ><a data-id="' + settings.tableIndex + '" id="paginationPage-' + $p + '" onclick="$(this).clickPagination(this);" class="paginationPage">First</a></li><li><a>...</a></li>';
                            $p = settings.skip - 3;
                            $paginationLength = settings.skip + 1;
                        }

                    } else {
                        htmlBanner += '<li  style="cursor: pointer;" ><a data-id="' + settings.tableIndex + '" id="paginationPage-' + $p + '" onclick="$(this).clickPagination(this);" class="paginationPage">First</a></li><li><a>...</a></li>';
                        $p = settings.skip - 4;
                        $paginationLength = $pagination;
                    }

                } else {
                    $paginationLength = $pagination;
                }
                for ($p; $p <= $paginationLength; $p++) {
                    if (($p === settings.skip)) {
                        $active = 'active';
                    } else {
                        $active = '';
                    }
                    htmlBanner += '<li class="' + $active + '" style="cursor: pointer;"><a onclick="$(this).clickPagination(this);" data-id="' + settings.tableIndex + '" id="paginationPage-' + $p + '" class="paginationPage">' + $p + '</a></li>';

                }
                if ($pagination > 5) {
                    $last = $pagination - settings.skip;
                    if ($last >= 2) {
                        htmlBanner += '<li><a>...</a></li><li style="cursor: pointer;"><a onclick="$(this).clickPagination(this);" data-id="' + settings.tableIndex + '" id="paginationPage-' + $pagination + '" class="paginationPage">Last</a></li>';
                    }
                }
                htmlBanner += '</ul>';
                htmlBanner += '</div>';
            }
            return htmlBanner;
        }

        function prepareSearch() {
            $searchValue = $('.datatable-search-input-' + settings.tableIndex).val();
            if (typeof $searchValue === 'undefined') {
                $searchValue = '';
            }
            if (settings.search === false) {
                return '';
            }
            var search = '';
            if ((settings.serverpagination === false) || ((settings.localpagination === true) && (settings.structure === 'local'))) {
                search = '<div id="searchHtml" class="pull-right"><ul style="margin: 9px;"  class="pagination" ><li style="float: left;"><input onkeyup="$(this).searchDatatable(this);" type="text" value="' + $searchValue + '" name="search" data-id="' + settings.tableIndex + '" class="form-control datatable-search datatable-search-input-' + settings.tableIndex + '" id="datatable-search"  /></li></ul></div>';
            } else if ((settings.serverpagination === true) && (settings.structure !== 'local')) {
                search = '<div id="searchHtml" class="pull-right"><ul style="margin: 9px;" class="pagination" ><li style="float: left;"><input type="text" value="' + $searchValue + '" name="search" class="form-control datatable-search-input-' + settings.tableIndex + '"  /></li><li><button style="padding: 6.5px 18px;margin-left: 7px;" data-id="' + settings.tableIndex + '" type="button" class="btn btn-sm btn-primary datatable-search" onclick="$(this).searchDatatable(this);" id="datatable-search">Search</button></li></ul></div>';
            }
            return search;
        }

        function callDataTable($this, searchValue, pageNo) {
            pageNo = pageNo || false;
            var params = settings.data;
            params.search = searchValue;
            var tIndex = settings.tableIndex;
            if (pageNo === false || tableSettings[tIndex].newcall === true) {
                tableSettings[tIndex].skip = 1;
            } else {
                tableSettings[tIndex].skip = pageNo;
            }
            $this.customeDataTable({
                tableIndex: settings.tableIndex,
                data: params,
                searchcolumns: settings.searchcolumns, // Sno - local - true, server - false 
                headers: settings.headers, // Sno - If want Sno - true otherwise Sno : false,
                structure: settings.structure, // servertable, localtable, json
                orderby: settings.orderby, // 0 - ascending, 1 - decending
                perpage: settings.perpage,
                actionurl: settings.actionurl,
                actiontype: settings.actiontype, // get, post,
                tableprepare: settings.tableprepare, // table preparefunction
                search: settings.search, // true or false,
                localpagination: settings.localpagination, // true or false it will use in full data get from server at on time.
                serverpagination: settings.serverpagination, // true or false
                newcall: settings.newcall,
                skip: settings.skip
            });
        }

        $.fn.setCursorPosition = function (pos) {
            this.each(function (index, elem) {
                if (elem.setSelectionRange) {
                    elem.setSelectionRange(pos, pos);
                }
            });
        };

        $.fn.searchDatatable = function (searchThis) {
            $dataid = $(searchThis).attr('data-id');
            console.log($dataid);
            settings.tableIndex = $dataid;
            tableSettings[$dataid].tableIndex = $dataid;
            if (settings.serverpagination === false) {
                __ajaxCall[$dataid] = false;
            }
            $searchValue = $('.datatable-search-input-' + $dataid).val();
            if (typeof $searchValue === 'undefined') {
                $searchValue = '';
            }
            tableSettings[$dataid].newcall = false;
            loadtableIndex[$dataid] = false;
            console.log($searchValue);
            callDataTable($this, $searchValue);
            console.log($searchValue);
            var searchValueLength = $searchValue.length;
            console.log(searchValueLength);
            $('.datatable-search-input-' + $dataid).focus().setCursorPosition(searchValueLength);
        };

        $.fn.clickPagination = function (paginationThis) {
            var id = $(paginationThis).attr('id');
            var idSplit = id.split('-');
            var pageNo = parseInt(idSplit[1]);
            $dataid = $(paginationThis).attr('data-id');
            console.log($dataid);
            if (settings.serverpagination === false) {
                __ajaxCall[$dataid] = false;
            }
            settings.tableIndex = $dataid;
            tableSettings[$dataid].tableIndex = $dataid;
            loadtableIndex[$dataid] = false;
            tableSettings[$dataid].newcall = false;
            callDataTable($this, '', pageNo);
        };

    };
})(jQuery);
