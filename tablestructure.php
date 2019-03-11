<?php 
$table = '<table>
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
            </table>';

$tableRecards = array('totalcount' => 4,'data' => $table);
echo json_encode($tableRecards);