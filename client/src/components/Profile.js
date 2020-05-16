import React from "react";
import { useState, useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
import profilePic from "../profile.png";
import Page404 from "./Page404";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState({});
  let id = "";
  useEffect(() => {
    async function fetch() {
      let person = await axios.get(
        "/api/user/8db0118a-bf18-4612-8efa-19624cf8a309"
      );
      console.log(person.data);
      setProfile(person.data);
    }
    fetch();
  }, []);

  if (!profile) return <Page404></Page404>;

  return (
    (
      <div className="flex row justify-content-center">
        <div className="col-sm-8 col-md-8 col-lg-8">
          <Card>
            {/* <Card.Img variant="top" src={profilePic} style={{width:"auto", align:"center"}}/> */}
            <Card.Body>
              <Card.Title>
                {profile.firstName} {profile.lastName}
              </Card.Title>
              <Card.Title>{profile.email}</Card.Title>
              <Card.Title> Public Key: {profile.publicKey}</Card.Title>
            
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {profile &&
                    profile.published &&
                    profile.published.map((reward, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            Article ID: {reward.articleId} reward :
                            {reward.cost}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-4 col-md-4 col-lg-4">
          <div className="table table-responsive">
            <img src={profilePic} alt={profile.firstName}></img>
          </div>
          Name: {profile.firstName} {profile.lastName}
        </div>
      </div>
    ) || "No Data"
  );
}
export default Profile;
