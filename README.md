# [jquery-ajax-table-pagination](https://open-source-plugins.github.io/jquery-ajax-table-pagination/)
Why This Plugin Developed
-------------------------
Generally every developer in their career they should create html table with pagination and search. Either data taking from server using ajax service call or static data. Using this plugin you can add add pagination and search  to html table easily. 

Features 
--------
1. This plugin can apply on multiple tables in same page.
2. We can create html table from ajax call.
3. 3 Type of tables we can hadle using this plugin.
  	a. Json
    b. Table
    c. Local
4. We can maintain search from Local or Server side
5. If you want to prepare table using ajax using signle call means only one time we will hit the server and get the data.

Integration
-----------
**Step 1**
```html
<script src="js/jquery.min.js"></script>
<script src="js/globaldatatables.min.js"></script>
```
**Add this code in your footer or any where you want**
```html
$('.datatable').customeDataTable({
        tableIndex : 1, // Index for each table in html page. Using this you can create multiple tables in same page
        data : {}, // this data values will directly send to server as a request data
        searchcolumns : [], // if you want to search specific columns in table you can pass here.
        orderby : 0, // 0 - ascending, 1 - decending -  It will use in ajax call only
        headers : [], // If you want to display custome table headers you can pass here.
        actionurl : ajax url,
        actiontype : "post", default is get. you can pass any type. 
        tableprepare : "datatable", // This is function name. writen by developer in their code to prepare  html table using server json data. it will be passing in json type only. 
        perpage : 3,
        structure : 'json', default is json. you can pass json / table / local 
        search : true, // default is true. If you pass false to this parameter. Search field will be removed from tamplate.
        newcall : false, // default is false. If you pass true to this parameter. When you want to raise a new ajax call meanse in your html page you are maintaining seperate search or page will have seperate tab system. In that you should pass true to this parameter
        //localpagination: false, // default is true. If you pass false to this parameter - pagination will hide
        serverpagination: false // default is true. If you pass false to this parameter. Plugin will be consider. coming full data from server in single ajax call. It will use in ajax call purpose only.
});
```


