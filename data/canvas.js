const axios = require("axios")
const coursesmodel = require("./models/course");
const assignmentmodel = require("./models/assignments");
const mongoose = require("mongoose");
const collections = require("./index");
var ObjectId = require('mongodb').ObjectId
const users = require("../data/users");

const userssmodel = require("./models/users");
const articlesmodel = require("./models/articles");
mongoose.Promise = global.Promise;

// const mongoConfig = require("../settings");
// const conn = mongoose.connect(mongoConfig.mongoConfig.serverUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: mongoConfig.mongoConfig.database,
// });

// mongoose.connection
//     .once("open", () =>
//         console.log("Connected to Atlas Using Mongoose inside data/articles")
//     )
//     .on("error", (error) => {
//         console.log("error is: " + error);
//     });


async function sendCoursesToDb(token, userId) {
    // userId="5eb9bb4afda1a60b18bc8040"
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    // token="1030~89QvpLfRQqfzX858dxlmXxmoeT9QYlafLA40h4R2LmPEgsv18RtljF3WCNOodFUP"
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    if (token === undefined || token === null || typeof token !== "string") {
        errors['token'] = "id is not defined or not valid";
        error.http_code = 400
    }

    if (userId === undefined || userId === null) {
        errors["id"] = "id is not defined";
        error.http_code = 400;
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({ errors: errors });
        throw error;
    }



    try {
        const res = await userssmodel.findOne({ _id: userId });
        let courseList = []
        let response = await axios.get("https://canvas.instructure.com/api/v1/courses", config)

        let data = response.data
        let res1 = await users.updateUser(userId, {
            "canvasToken": token,
            "canvasUserId": data[0]["enrollments"][0]["user_id"]
        }, true);

        for (let i = 0; i < data.length; i++) {
            console.log(data[i])
            if (data[i]["enrollments"][0]["type"] == "student") {
                try {
                    let course = await coursesmodel.create({
                        "id": data[i]["id"],
                        "UserID": res["_id"],
                        "name": data[i]["name"],
                        "account_id": data[i]["account_id"],
                        "uuid": data[i]["uuid"],
                        "start_at": data[i]["start_at"],
                        "grading_standard_id": data[i]["grading_standard_id"],
                        "is_public": data[i]["is_public"],
                        "created_at": data[i]["created_at"],
                        "course_code": data[i]["course_code"],
                        "default_view": data[i]["default_view"],
                        "root_account_id": data[i]["root_account_id"],
                        "enrollment_term_id": data[i]["enrollment_term_id"],
                        "license": data[i]["license"],
                        "grade_passback_setting": data[i]["grade_passback_setting"],
                        "end_at": data[i]["end_at"],
                        "public_syllabus": data[i]["public_syllabus"],
                        "public_syllabus_to_auth": data[i]["public_syllabus_to_auth"],
                        "storage_quota_mb": data[i]["storage_quota_mb"],
                        "is_public_to_auth_users": data[i]["is_public_to_auth_users"],
                        "apply_assignment_group_weights": data[i]["apply_assignment_group_weights"],
                        "calendar": data[i]["calendar"],
                        "time_zone": data[i]["time_zone"],
                        "blueprint": data[i]["blueprint"],
                        "enrollments": data[i]["enrollments"],
                        "hide_final_grades": data[i]["hide_final_grades"],
                        "workflow_state": data[i]["workflow_state"],
                        "restrict_enrollments_to_course_dates": data[i]["restrict_enrollments_to_course_dates"],
                        "overridden_course_visibility": data[i]["overridden_course_visibility"]
                    })
                } catch (e) {
                    console.log(e)
                    throw e;
                }
            }
        }
        return courseList;
    }
    catch (e) {
        throw e;
    }
}

async function sendAssignmentToDb(userId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (userId === undefined || userId === null) {
        errors["id"] = "id is not defined";
        error.http_code = 400;
    }
    if (error.http_code !== 200) {
        error.message = JSON.stringify({ errors: errors });
        throw error;
    }
    let courses = await getCoursesByUserId(userId);
    const res = await userssmodel.findOne({ _id: userId });
    let token = res["canvasToken"];
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    for (let j = 0; j < courses.length; j++) {
        try {

            let response = await axios.get("https://canvas.instructure.com//api/v1/users/" + courses[j]["enrollments"][0]["user_id"].toString() + "/courses/" + courses[j]["id"] + "/assignments", config)
            response = response.data;
            //  console.log(response);
            for (let i = 0; i < response.length; i++) {
                let keywords = [];
                keywords.push(courses[j]["name"]);
                keywords.push(courses[j]["course_code"]);
                keywords.push(response[i]["name"]);
                let assignments = await assignmentmodel.create({
                    "id": response[i]["id"],
                    "courseId": courses[j]["id"],
                    "userId": userId,
                    "keywords": keywords,
                    "description": response[i]["description"],
                    "due_at": response[i]["due_at"],
                    "unlock_at": response[i]["unlock_at"],
                    "lock_at": response[i]["lock_at"],
                    "points_possible": response[i]["points_possible"],
                    "grading_type": response[i]["grading_type"],
                    "assignment_group_id": response[i]["assignment_group_id"],
                    "grading_standard_id": response[i]["grading_standard_id"],
                    "created_at": response[i]["created_at"],
                    "updated_at": response[i]["updated_at"],
                    "peer_reviews": response[i]["peer_reviews"],
                    "automatic_peer_reviews": response[i]["automatic_peer_reviews"],
                    "position": response[i]["position"],
                    "grade_group_students_individually": response[i]["grade_group_students_individually"],
                    "anonymous_peer_reviews": response[i]["anonymous_peer_reviews"],
                    "group_category_id": response[i]["group_category_id"],
                    "post_to_sis": response[i]["post_to_sis"],
                    "moderated_grading": response[i]["moderated_grading"],
                    "omit_from_final_grade": response[i]["omit_from_final_grade"],
                    "intra_group_peer_reviews": response[i]["intra_group_peer_reviews"],
                    "anonymous_instructor_annotations": response[i]["descrianonymous_instructor_annotationsption"],
                    "anonymous_grading": response[i]["anonymous_grading"],
                    "graders_anonymous_to_graders": response[i]["desgraders_anonymous_to_graderscription"],
                    "grader_count": response[i]["grader_count"],
                    "grader_comments_visible_to_graders": response[i]["grader_comments_visible_to_graders"],
                    "final_grader_id": response[i]["final_grader_id"],
                    "grader_names_visible_to_final_grader": response[i]["grader_names_visible_to_final_grader"],
                    "allowed_attempts": response[i]["allowed_attempts"],
                    "secure_params": response[i]["secure_params"],
                    "course_id": response[i]["course_id"],
                    "name": response[i]["name"],
                    "submission_types": response[i]["submission_types"],
                    "has_submitted_submissions": response[i]["has_submitted_submissions"],
                    "due_date_required": response[i]["due_date_required"],
                    "max_name_length": response[i]["max_name_length"],
                    "in_closed_grading_period": response[i]["in_closed_grading_period"],
                    "is_quiz_assignment": response[i]["is_quiz_assignment"],
                    "can_duplicate": response[i]["can_duplicate"],
                    "original_course_id": response[i]["original_course_id"],
                    "original_assignment_id": response[i]["original_assignment_id"],
                    "original_assignment_name": response[i]["original_assignment_name"],
                    "original_quiz_id": response[i]["original_quiz_id"],
                    "workflow_state": response[i]["workflow_state"],
                    "muted": response[i]["muted"],
                    "html_url": response[i]["html_url"],
                    "allowed_extensions": response[i]["allowed_extensions"],
                    "published": response[i]["published"],
                    "only_visible_to_overrides": response[i]["only_visible_to_overrides"],
                    "locked_for_user": response[i]["locked_for_user"],
                    "submissions_download_url": response[i]["submissions_download_url"],
                    "post_manually": response[i]["post_manually"],
                    "anonymize_students": response[i]["anonymize_students"],
                    "require_lockdown_browser": response[i]["require_lockdown_browser"]
                })
                console.log(assignments)
            }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }


}

async function getCoursesByUserId(userId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    if (userId === undefined || userId === null) {
        errors["id"] = "id is not defined";
        error.http_code = 400;
    }
    if (error.http_code !== 200) {
        error.message = JSON.stringify({ errors: errors });
        throw error;
    }

    try {
        let courses = await coursesmodel.find({ UserID: userId });
        return courses;

    }
    catch (e) {
        console.log(e)
        throw e;

    }
}

async function getAssignmentsByUserId(userId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (userId === undefined || userId === null) {
        errors["id"] = "id is not defined";
        error.http_code = 400;
    }
    if (error.http_code !== 200) {
        error.message = JSON.stringify({ errors: errors });
        throw error;
    }
    try {
        let assignments = await assignmentmodel.find({ userId: userId });
        return assignments;

    }
    catch (e) {
        console.log(e)
        throw e;

    }

}
async function getAssignmentKeywordsByUserId(userId) {
    userId="5eb9bb4afda1a60b18bc8040";
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    if (userId === undefined || userId === null) {
        errors["id"] = "id is not defined";
        error.http_code = 400;
    }
    if (error.http_code !== 200) {
        error.message = JSON.stringify({ errors: errors });
        throw error;
    }
    try {
        projection = { "keywords": true }
        let allkeyword=new Set(); 
        let allkeywordsarray = await assignmentmodel.find({ userId: userId },projection);
        for(let i=0;i<allkeywordsarray.length;i++){
            for(let j=0;j<allkeywordsarray[i]["keywords"].length;j++){
                allkeyword.add(allkeywordsarray[i]["keywords"][j]);
            }
        }
        console.log(allkeyword);
        return allkeyword;

    }
    catch (e) {
        console.log(e)
        throw e;

    }

}
module.exports = {
    getCoursesByUserId,
    sendAssignmentToDb,
    sendCoursesToDb,
    getAssignmentsByUserId,
    getAssignmentKeywordsByUserId
};
