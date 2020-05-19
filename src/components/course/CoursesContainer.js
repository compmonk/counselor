import React from "react";
import { useState, useEffect, useContext } from "react";
import { Card } from "react-bootstrap";
import { Button, Col, Form, Badge } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import Loading from "../others/Loading";
function CoursesContainer() {
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isChanged, setisChanged] = useState(true);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  let list = undefined;
  useEffect(() => {
    async function fetch() {
      console.log("heyy");
      var { data } = await axios.get("/api/user/detail");
      if (data["canvasToken"] != undefined) {
        var { data } = await axios.get("/api/user/courses");
        //  console.log("lists->", data);
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
    if (isChanged) fetch();
  }, [isChanged]);

  const getCourses = async function getCourses(e) {
    setisLoading(true);
    setError(false);

    var dat = {
      token: token,
    };
    try {
      var { data } = await axios.post("/api/user/integrate", dat);
      if (data[0]["name"] !== undefined) setisChanged(true);
    } catch (er) {
      setisChanged(false);
      setError(true);
    }
  };
  if (error) {
    return (
      <div>
        <Form className="container-fluid col-lg-6 counselor-form">
          <Badge variant="danger">Please enter valid token!</Badge>{" "}
          <Form.Group as={Col} controlId="formGridGenerateToken">
            <Form.Text className="text-muted">
              Please Integrate Canvas by generating a Token.
            </Form.Text>
            <Button
              onClick={() =>
                window.open("https://sit.instructure.com/profile/settings#")
              }
            >
              Generate Canvas Token
            </Button>
          </Form.Group>
          <Form.Group as={Col} controlId="formGridCanvasToken">
            <Form.Label>Canvas Token:</Form.Label>
            <Form.Control
              name="token"
              type="input"
              onChange={(e) => setToken(e.target.value)}
              placeholder="Canvas Token"
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={getCourses}>
            Submit
          </Button>
        </Form>
      </div>
    );
  } else if (isLoading) {
    return <Loading />;
  } else if (!courses.length) {
    return (
      <div>
        <Form className="container-fluid col-lg-6 counselor-form">
          <Form.Group as={Col} controlId="formGridGenerateToken">
            <Form.Text className="text-muted">
              Please Integrate Canvas by generating a Token.
            </Form.Text>
            <Button
              onClick={() =>
                window.open("https://sit.instructure.com/profile/settings#")
              }
            >
              Generate Canvas Token
            </Button>
          </Form.Group>
          <Form.Group as={Col} controlId="formGridCanvasToken">
            <Form.Label>Canvas Token:</Form.Label>
            <Form.Control
              name="token"
              type="input"
              onChange={(e) => setToken(e.target.value)}
              placeholder="Canvas Token"
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={getCourses}>
            Submit
          </Button>
        </Form>
      </div>
    );
  } else {
    return (
      <div className="flex row">
        {(courses &&
          courses.map((course, index) => {
            return (
              <div key={index} className="col-sm-4 col-md-4 col-lg-4">
                <Card key={index}>
                  <Card.Body>
                    <Card.Title>
                      {index + 1}. {course.name}
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
