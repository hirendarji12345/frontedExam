import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import Navbarstudent from './studentNavbar'
import axios from 'axios';
import { useForm } from 'react-hook-form';

function Result() {
    const { useState } = React;

    const [apidata, setApidata] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [match, setMatch] = useState('');
    const [error, setError] = useState(false);
    // const [data, setData] = useState([]);
    useEffect(() => {
        getdata();
    }, [])

    function getdata() {
        let x = [];
        let username=localStorage.getItem("Student_Name");
        axios.get('https://bakendexam.herokuapp.com/result/'+username).then(res => {
           // console.log("api response", res["data"]);
            res["data"].map((item) => {
                let temp = {}
                temp["username"] = item["username"];
                let IST_Time= new Date(item["date"]).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});

                temp["date"] = IST_Time + " IST";
                temp["result"] = item["result"];
                //console.log(temp);
                x.push(temp);

            })
            //console.log(apidata)
            setApidata(x);

        }).catch((err) => console.log(err));
    }
    const [data, setData] = useState([]);

    //----------------------------------------------------
    const [columns, setColumns] = useState([

        { title: 'username', field: 'username'},
        { title: 'result', field: 'result', },
        { title: 'date', field: 'date', },


    ]);



    return (<>
        <Navbarstudent />
        <MaterialTable
            title="Result table"
            columns={columns}
            data={apidata}
            />
        
    </>
    )
}
export default Result;





