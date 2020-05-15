const axios=require("axios");



async function getcourse(token) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};
    token="1030~89QvpLfRQqfzX858dxlmXxmoeT9QYlafLA40h4R2LmPEgsv18RtljF3WCNOodFUP"
    const config = {
    headers: { Authorization: `Bearer ${token}` }
    };

    if (token === token || token === token) {
        errors['token'] = "id is not defined";
        error.http_code = 400
    }

    try{

        let courseList=[]
        let response= await axios.get("https://canvas.instructure.com/api/v1/courses",config)
     // console.log(response.data[0])
        let data=response.data
        for(let i=0;i<data.length;i++){
            console.log(data[i])
            let courseId=data[i]["id"];
            let courseCode=data[i]["course_code"];
            let courseName=data[i]["name"];
            let canvasUserId=data[i]["enrollments"][0]["user_id"];
            
        }

       }
       catch(e){
        throw "Invalid Token! Enter New Token."
       }
}

getcourse();