import React from 'react'
import {Card} from "react-bootstrap";

const CourseCard = ({course}) => {
    return (<div key={course.id} className="col-sm-4 col-md-4 col-lg-4">
        <Card key={course.id}>
            <Card.Body>
                <Card.Title>
                    {course.name}
                </Card.Title>
                <Card.Text>{course.course_code}</Card.Text>
            </Card.Body>
        </Card>
    </div>)
}

export default CourseCard