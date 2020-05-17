import React from "react";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Button, Col, Form } from "react-bootstrap";
import axios from "axios";
function CoursesContainer() {
    const [courses, setCourses] = useState([]);
    const [token, setToken] = useState("");
    const [isLoading, setisLoading] = useState(false);
    let list = undefined;
    useEffect(() => {
        async function fetch() {
            const { data } = await axios.get("/api/user/courses");
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