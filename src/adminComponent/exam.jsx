import React, { useEffect, useState, useRef } from 'react';
import './exam.css';
import axios from 'axios';
import Navbarstudent from './studentNavbar'
import { useHistory } from 'react-router-dom';
import { ValidationForm, Radio } from "react-bootstrap4-form-validation";

const Exam = () => {

    const [count, setCount] = useState(1);
    const [answer, setAnswer] = useState("");
    const [data, setData] = useState([]);
    const [final, setfinal] = useState([]);
    const [maxno, setMaxno] = useState(0);
    const [score, setScore] = useState(0);
    const [sameQuestion, setSameQuestion] = useState("false");
    const history = useHistory();
    const myrefform = useRef(null);
    const createFieldFormRef = useRef();
    const [radioDefault, setRadioDefault] = useState(null);
    const [question, setQuestion] = useState("");
    const [ansColor,SetAnsColor]=useState("red");
    const [question_no,setQuestion_No]=useState(null);




    useEffect(() => {
        getdata();
        getalldata();
    }, []);


    const previous = (e) => {
        let x;
        count == 1 ? x = 1 : x = count - 1;
        directgetquestion(x);
        if (count > 1) {
            resetForm();
        }
    }
    const next = (e) => {
        let x;
        count == maxno ? x = maxno : x = count + 1;
        directgetquestion(x);
        if (count < maxno) {
            resetForm();
        }


    }

    function getalldata() {
        let x = [];
        axios.get('https://bakendexam.herokuapp.com/question/').then(res => {
            setMaxno(res["data"].length);
        }).catch((err) => console.log(err));
    }


    function getdata() {
        directgetquestion(count);
    }

    function directgetquestion(number) {
        let x = [];
        setCount(number);
        setAnswer(null);
        axios.get('https://bakendexam.herokuapp.com/question/' + number).then(res => {
            setData(res["data"][0]);
            setQuestion(res["data"][0]["question"]);
            setQuestion_No(res["data"][0]["question_no"]);
            let tempQuestion = res["data"][0]["question"];
            final.map((item) => {
                if (tempQuestion == Object.keys(item).toString()) {
                    let temp = item[Object.keys(item)];
                    setRadioDefault(temp);
                }
            })
        }).catch((err) => console.log(err));
    }

    function selectoption(e) {
        //console.log(e.target.value);
        let x = e.target.value;
        setAnswer(x);
        setRadioDefault(x);

    }

    function save() {
       
        if(answer != null)
        {
            let temp="rank"+question_no;
        document.getElementById(temp).style.backgroundColor = "green";
        let x = {}
        x[data["question"]] = answer || null;
        var resultObject = searchQuestion(Object.keys(x), final);
        if (resultObject == "updated success") {
         //   console.log("fine all");
        }
        else {
            final.push(x);
            setfinal(final);
        }
        }
        
        
    }

    function searchQuestion(nameKey, myArray) {
        for (let i of myArray) {
            if (Object.keys(i).toString() == nameKey) {
                for (let i = 0; i < myArray.length; i++) {
                    if (Object.keys(myArray[i]).toString() == nameKey) {
                        myArray[i][nameKey] = answer;
                        break;
                    }
                }
                return "updated success"
            }
        }
    }

    const resetForm = () => {
        setRadioDefault(null);
        let formRef = createFieldFormRef.current;
        if (formRef !== null) {
            formRef.resetValidationState(false);
        }
    }



    function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].question == nameKey) {
                return myArray[i]["answer"];
            }
        }
    }


    function submitHandler() {
        let anskey = []
       // console.log(final);
        axios.get('https://bakendexam.herokuapp.com/question/').then((res) => {
            res["data"].map((item) => {
                let x = {}
                x["question"] = item["question"];
                x["answer"] = item["answer"];
                anskey.push(x);
            })
            let temp = 0;
            final.map((item) => {
                var resultObject = search(Object.keys(item), anskey);
                if (resultObject == item[(Object.keys(item))]) {
                    temp += 1;
                }
            });
            setScore(temp);

           // console.log("your result is " + temp);
            let date = new Date();
            let username = localStorage.getItem("Student_Name");
            // console.log(username,date,temp);
            var data =
            {
                "username": username,
                "result": temp,
                "date": date.toUTCString()
            }
          //  console.log(data);
            axios.post('https://bakendexam.herokuapp.com/user/', data).then((res) => {
               // console.log("on submit question :-", res);
            }).catch((err) => { console.log("add error", err) });
            //  history.push("/studentNavbar");


        }).catch((err) => { console.log("add error", err) });

        history.push('/studentNavbar');

    }

    var lis = [];
    for (let i = 1; i < maxno + 1; i++) {
        lis.push(<div class="col-3">
            <button style={{borderRadius:"25px"}}  id={`rank${i}`} type="button" onClick={() => { directgetquestion(i) }} class="btn btn-primary">{i}</button>
        </div>);
    }

    return (
        <>
            <Navbarstudent />

            <div class="container mt-5">

                <div class="d-flex justify-content-center row">
                    <div class="col-md-10 col-lg-10">
                        <div class="border">
                            <ValidationForm

                                onError={(errors) => console.log(errors)}
                                ref={createFieldFormRef}
                                id="create-field-trial">
                                <div class="question bg-white p-3 border-bottom">
                                    <div class="d-flex flex-row align-items-center question-title">
                                        <h3 class="text-danger">{data["question_no"]}.</h3>
                                        <h5 class="mt-1 ml-2">{data["question"]}</h5>
                                    </div>

                                    <Radio.RadioGroup name="option" required inline={false} valueSelected={radioDefault} onChange={selectoption}>

                                        <Radio.RadioItem id={data["optionA"]} label={data["optionA"]} value={data["optionA"]} />


                                        <Radio.RadioItem id={data["optionB"]} label={data["optionB"]} value={data["optionB"]} />


                                        <Radio.RadioItem id={data["optionC"]} label={data["optionC"]} value={data["optionC"]} />



                                        <Radio.RadioItem id={data["optionD"]} label={data["optionD"]} value={data["optionD"]} />


                                    </Radio.RadioGroup>

                                </div>

                                <div class="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
                                    <button class="btn btn-primary d-flex align-items-center btn-danger" onClick={(e) => previous(e)} type="button"><i class="fa fa-angle-left mt-1 mr-1"></i>&nbsp;Previous</button>
                                    <button class="btn btn-primary border-success align-items-center btn-success" onClick={(e) => save(e)} type="button">Save<i class="fa fa-angle-right ml-2"></i></button>
                                    <button class="btn btn-primary border-success align-items-center btn-success" onClick={(e) => next(e)} type="button">Next<i class="fa fa-angle-right ml-2"></i></button>

                                </div>
                            </ValidationForm>
                        </div>

                        <br /><div class="text-center">
                            <button type="button" onClick={submitHandler} class="btn btn-primary">Submit Test</button>
                        </div>
                    </div>
                    <div className="col-md-2 col-lg-2"

                        style={{ backgroundColor: 'pink', float: 'right', height: "300px", width: "200px", borderRadius: "10px" }}>


                        <div class="row">
                            {lis}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Exam;