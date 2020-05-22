import React, {useContext} from "react";
import {useState, useEffect} from "react";
import {Card} from "react-bootstrap";
import {Button, Col, Form, Badge} from "react-bootstrap";
import axios from "axios";
import Loading from "../others/Loading";
import {AuthContext} from "../auth/AuthContext";
import CourseCard from "./CourseCard";

function CoursesContainer() {
    const {currentUser} = useContext(AuthContext)
    const [courses, setCourses] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isChanged, setisChanged] = useState(true);
    useEffect(() => {
        async function fetchData() {
            if (currentUser && currentUser.hasOwnProperty("canvasToken")) {
                const {data} = await axios.get("/api/user/courses");
                setCourses(data);
                if (data.length > 0) {
                    setisLoading(false);
                    setError(false);
                    setisChanged(false);
                }
            } else {
                setCourses([]);
                setisLoading(false);
                setError(false);
                setisChanged(false);
            }
        }

        fetchData()
    }, []);

    const integrate = async function integrate(e) {
        e.preventDefault()
        const payLoad = {
            token: e.target.elements.token.value
        }
        console.log(payLoad)
        setError(false);
        try {
            const {data} = await axios.post("/api/user/integrate", payLoad);
            console.log(data)
            if (data[0]["name"]) {
                setisChanged(true)
                setisLoading(false);
                window.location.href = "/courses"
            }
        } catch (er) {
            setisChanged(false);
            setError(true);
        }
    };


    const getCourses = async () => {
        if (currentUser && currentUser.hasOwnProperty("canvasToken") && !courses.length) {
            const {data} = await axios.get("/api/user/courses");
            setCourses(data);
            setisLoading(false);
            if (data.length > 0) {
                setError(false);
                setisChanged(false);
            }
        }
    }


    if (isLoading) {
        return <Loading/>;
    }

    if (currentUser && currentUser.hasOwnProperty("canvasToken")) {
        getCourses()
        return (
            <div className="flex row">
                {(courses &&
                    courses.map((course) => {
                        return (
                            <CourseCard course={course}/>
                        );
                    })) ||
                "No Data"}
            </div>
        );
    } else {
        return (
            <div>
                <Form className="container-fluid col-lg-6 counselor-form" onSubmit={integrate}>
                    <Form.Text className="text-muted">
                        {currentUser && currentUser.hasOwnProperty("canvasToken") ? currentUser.canvasUserId : null}
                    </Form.Text>
                    {error ? <Badge variant="danger">Please enter valid token!</Badge> : null}
                    <Form.Group as={Col} controlId="formGridGenerateToken">
                        <Form.Text className="text-muted">
                            Please Integrate Canvas by generating a Token.
                        </Form.Text>
                        <Button onClick={() => window.open("https://sit.instructure.com/profile/settings#")}>
                            Generate Canvas Token
                        </Button>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCanvasToken">
                        <Form.Label>Canvas Token:</Form.Label>
                        <Form.Control name="token" type="input" placeholder="Canvas Token"/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Integrate
                    </Button>
                </Form>
            </div>
        );

    }
}

export default CoursesContainer;
