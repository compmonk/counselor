import React from "react";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Button, Col, Form } from "react-bootstrap";
//import Page404 from "./Page404";
//import "../App.css";
import axios from "axios";
function CoursesContainer() {
    const [courses, setCourses] = useState([]);
    const [token, setToken] = useState("");
    const [isLoading, setisLoading] = useState(false);
    let list = undefined;
    useEffect(() => {
        async function fetch() {
            console.log("heyy")
            const { data } = await axios.get("/api/user/courses");
          //  console.log("lists->", data);
            setCourses(data);
            if(courses.length>0){
                setisLoading(false)
            }
        }
        fetch();
    }, [courses]);

    const getCourses = async function getCourses() {
        setisLoading(true);
       let {data} = await axios({
            method: 'post',
            url: "/api/user/integrate",
            headers: {}, 
            data: {
            token: token,
            }
          });
          console.log("onClick");
          //console.log(data);
          setCourses(data)
       
    };

    if(isLoading){
        return <div>Loading....</div>;
    }
    else if (!courses.length) {
        return (
        <div>
            <div>Please Integrate Canvas!</div>
            <Form className="container-fluid col-lg-6 form" >           
             <Form.Group as={Col} controlId="formGridFirstName">
                <Form.Label>
                    Enter Canvas Token:
                </Form.Label>
                <Form.Control name="token" type="input"  onChange={e => setToken(e.target.value)}  placeholder="token" />
            </Form.Group>  
            <Button variant="primary" type="submit" onClick={getCourses} >
                    Submit
            </Button>
            </Form>
            </div>
            )
    }
    else {
        return (
            <div className="flex row">
                {(courses &&
                    courses.map((course, index) => {
                        // article.text = article.text.substring(0, 100) + "...";
                        return (
                            <div key={index} className="col-sm-4 col-md-4 col-lg-4">
                                <Card key={index}>
                                    <Card.Body>
                                        <Card.Title>
                                            {index + 1}.  {course.name}
                                        </Card.Title>

                                        <Card.Text>{course.course_code}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })) ||
                    "No Data"}
            </div>
        );
    }
}

export default CoursesContainer;


// import Page404 from "./Page404";
// import "../App.css";
// import axios from "axios";

// function Recommend() {

// }
// export default Recommend;


// import React from 'react'

// import Select from 'react-select';
// function SignUp()
//  {    const scaryAnimals = [
//         {label: "Alligators", value: 1},
//         {label: "Crocodiles", value: 2},
//         {label: "Sharks", value: 3},
//         {label: "Small crocodiles", value: 4},
//         {label: "Smallest crocodiles", value: 5},
//         {label: "Snakes", value: 6},
//     ];    return (
//         <Form className="container-fluid col-lg-6 form">            <Form.Group as={Col} controlId="formGridFirstName">
//                 <Form.Label>First Name</Form.Label>
//                 <Form.Control type="input" placeholder="John"/>
//             </Form.Group>            <Form.Group as={Col} controlId="formGridLastName">
//                 <Form.Label>Last Name</Form.Label>
//                 <Form.Control type="input" placeholder="Doe"/>
//             </Form.Group>            <Form.Group as={Col} controlId="formGridEmail">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control type="email" placeholder="johndoe@example.com"/>
//             </Form.Group>            <Form.Group as={Col} controlId="formGridPassword">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control type="password" placeholder="S3cR3t"/>
//             </Form.Group>            <Form.Group as={Col} controlId="formGridState">
//                 <Form.Label>Currency</Form.Label>
//                 <Select options={scaryAnimals}/>
//             </Form.Group>            <Button variant="primary" type="submit">
//                 Submit
//             </Button>
//         </Form>
//     )
// }export default SignUp;