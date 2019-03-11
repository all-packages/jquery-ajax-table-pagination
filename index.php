<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <link href="bootstrap.css" rel="stylesheet" />
        <script src="jquery.min.js"></script>
        <script src="serverDataTables.js"></script>
        <script src="bootstrap.min.js"></script>
    </head>
    <body>
        <div class="datatable">
            <table>
               <thead>
               <tr>
               <th>column1</th>
               <th>column2</th>
               <th>column3</th>
               <th>column4</th>
               </tr>
               </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>1</td>
                        <td>6</td>
                        <td>7</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="datatable1">
            <table>
               <thead>
               <tr>
               <th>column1</th>
               <th>column2</th>
               <th>column3</th>
               <th>column4</th>
               </tr>
               </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>1</td>
                        <td>6</td>
                        <td>7</td>
                    </tr>
                </tbody>
            </table>
            
            
        </div>
        
        <div class="datatable2">
            <table>
               <thead>
               <tr>
               <th>column1</th>
               <th>column2</th>
               <th>column3</th>
               <th>column4</th>
               </tr>
               </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>1</td>
                        <td>6</td>
                        <td>7</td>
                    </tr>
                </tbody>
            </table>
            
            
        </div>
        <script>
            /*$(document).ready(function(){
               $rows = $('table tbody');
               $jsonTable = [];
               $search = '4';
               console.log($rows);
               $columns = {};
               $('table tbody tr').each(function(){
                   $jsonrow = [];
                   $i = 0;
                   $match = false;
                   $(this).children('td').each(function(){
                      $jsonrow[$i] = $(this).text(); 
                      $i++;
                   });
                   $jsonrow = $.grep($jsonrow, function( a ) {
                            $regx = new RegExp($search);
                            if(a.match($regx)){
                                return true;
                            }else{
                                return false;
                            }
                         });
                    if($jsonrow.length > 0){
                           $jsonTable.push($jsonrow);
                    }
               });
               console.log($jsonTable);
            });*/
               $('.datatable').customeDataTable({
                   searchcolumns : [],
                   orderby : 0,
                   headers : [],
                   actionurl : "tablestructure.php",
                   actiontype : "post",
                   tableprepare : "datatable",
                   perpage : 3,
                   structure : 'local',
                   //localpagination: false, // true or false it will use in full data get from server at on time.
                   serverpagination: false // true or false
               });
               
               $('.datatable1').customeDataTable({
                   tableIndex : 2,
                   searchcolumns : [],
                   orderby : 0,
                   headers : [],
                   actionurl : "tablestructure.php",
                   actiontype : "post",
                   tableprepare : "datatable",
                   perpage : 2,
                   structure : 'table',
                   //localpagination: true, // true or false it will use in full data get from server at on time.
                   //serverpagination: false // true or false
               });
               
               $('.datatable2').customeDataTable({
                   tableIndex : 3,
                   searchcolumns : [],
                   orderby : 0,
                   headers : [],
                   actionurl : "tablestructure.php",
                   actiontype : "post",
                   tableprepare : "datatable",
                   perpage : 1,
                   structure : 'local',
                   //localpagination: true, // true or false it will use in full data get from server at on time.
                   serverpagination: false // true or false
               });
               
               function datatable(response){
                   var jsonParse = JSON.parse(response);
                   $table = '<tbody>';
                   $.each(jsonParse.data,function(key,value){
                    $table += '<tr><td>'+value._id+'</td></tr>';   
                   });
                   $table += '</tbody>';
                   return $table;
               }
                
        </script>
    </body>
</html>
